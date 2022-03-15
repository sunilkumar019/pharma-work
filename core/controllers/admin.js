//import use cases
const addAdmin = require("../usecases/admin/addAdmin")
const addToken = require("../usecases/admin/addToken")
const getAdmin = require("../usecases/admin/getAdmin")
const updateAdmin = require("../usecases/admin/updateAdmin")
const jwt = require("jsonwebtoken");
const comparaPassword = require("../usecases/admin/comparePassword");

const sendEmail = require("../usecases/Email");

//import moment for date formatting
const moment = require("moment");
//import bcrypt for pasword hashing
const bcrypt = require("bcrypt");

//Formatter
const Formatter = require("../Formatters/index")

exports.getAdminDetails = async() =>{

    let adminRecord = await getAdmin({});
    if(!adminRecord) return null;
    return {
        name: adminRecord.name,
        email: adminRecord.email,
        phone: adminRecord.phone,
        company: adminRecord.company
    }
}

//Add admin
exports.addAdmin = async (pic,admin)=>{

    if (!admin.name) throw new Error('admin Name is Required');
    if (!admin.email) throw new Error('admin email is Required');
    if (!admin.phone) throw new Error('admin phone is Required');
    if (!admin.company) throw new Error('admin company is Required');
    if (!admin.password) throw new Error('admin password is Required');
    if (pic == undefined) admin.profile_pic = null;
    else admin.profile_pic = pic.path;
    //hashing password
    let passwordHash = bcrypt.hashSync(admin.password,10);
    
    let newadmin = {
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        company:admin.company,
        profile_pic:admin.profile_pic,
        password_hash:passwordHash,
        created_on: new Date(Date.now())
    }
    let savedadmin = await addAdmin(newadmin);

    delete savedadmin.__v
    delete savedadmin.modified_on
    delete savedadmin.created_on
    delete savedadmin.password_hash

    return savedadmin;
}

exports.adminLogin = async(adminprops)=>{
    let adminRecord = await getAdmin({email:adminprops.email})

    if(!adminRecord)
        return {Error:"Invalid Email"}
    const PasswordMatch = await bcrypt.compare(adminprops.password, adminRecord.password_hash);
    if(!PasswordMatch)
        return {Error:"Password not matched"}
   
    const token = jwt.sign(
            {
                Id: adminRecord._id,
                Name:adminRecord.name,
                Company:adminRecord.company,
                Email:adminRecord.email,
                Phone:adminRecord.phone,
                Profile_pic:adminRecord.profile_pic
            },
            "secret"
            ,
            { expiresIn: 619999}
        );

    adminRecord =  {
        token:token
    }
    return adminRecord;
}

exports.adminProfile = async(admin)=>{
   let adminData = {
        id:admin.Id,
        name:admin.Name,
        email:admin.Email,
        phone:admin.Phone,
        company:admin.Company,
        profile_pic :admin.Profile_pic ? `${process.env.BASE_URL}/${ admin.Profile_pic}` : null ,

   };
   return adminData;
}

//update admin
exports.updateAdmin = async(pic,props)=>{
    let adminId = props.id;
    if(!props.id) throw new Error("Please provide admin Id");
    let filter = {}
    if(props.name) filter.name = props.name;
    if(props.company) filter.company = props.company;
    if(props.email) filter.email = props.email;
    if(props.phone) filter.phone = props.phone;
    if (pic) filter.profile_pic = pic.path;

    filter.modified_on = new Date(Date.now());
    let adminRecord = await updateAdmin(adminId,filter);
    return adminRecord;
}

exports.changePassword = async(props)=>{
    let adminId = props.id;
    if(!props.id) throw new Error("Please provide rep Id");
    if(!props.oldPassword) throw new Error("Please provide Old Password");
    if(!props.newPassword) throw new Error("Please provide New Password");

    let id = props.id;
    let oldPassword = props.oldPassword;
    let response = await comparaPassword(id,oldPassword);
    if(!response) throw new Error("Password Not Matched!")
    
    let filter = {}
    filter.password_hash = bcrypt.hashSync(props.newPassword,10);
    filter.modified_on = new Date(Date.now());
    let adminRecord = await updateAdmin(adminId,filter);
    return adminRecord
}

//reset password
exports.resetPassword = async(adminEmail)=>{

    let adminRecord = await getAdmin({email:adminEmail})

    if(!adminRecord)  throw new Error("No account found !!!")

    let adminId = adminRecord._id;

    let token = adminRecord.getResetPasswordToken()

    let link = `${process.env.BASE_URL}/#/resetPassword/${adminId}/${token}`;

    let filter = {};
    filter.adminId = adminId;
    filter.conditions = { $set: { token: token, token_expire_in: adminRecord.token_expire_in } }

    let EmailData = {
        To : adminRecord.email,
        Subject: "Password Reset",
        Body: `
           <!DOCTYPE html>
            <html lang="en">
            <head>
                <style>
                    .main__container {
                        background-color: #e1e1e1;
                        padding: 10px;
                    }
                    .main__inner {
                        border-radius: 3px;
                        width: 600px;
                        margin: 50px 200px;
                        padding: 25px;          
                        background-color: white;
                    }
                    p {
                        font-size: 17px;
                        color: rgba(0,0,0,0.74);
                    }
                    .company {
                        font-family: Helvetica Neue, Helvetica, Arial,serif;
                        font-style: italic;
                    }
                    a {
                        margin-left: 150px;
                        width: 60%;
                        border-radius: 25px;
                        padding: 10px 40px;
                        color: #ffffff;
                        text-decoration: none;
                        background-image: linear-gradient(to right, #32be8f, #38d39f, #32be8f);
                        font-size: 21px;
                        text-align: center;
                        font-family: "Poppins", sans-serif;
                        cursor: pointer;
                        transition: 0.5s
                    }
                </style>
            </head>
            <body>
                <div class="main__container">
                    <div class="main__inner">
                    <h1>Reset Your Admin Password</h1>
                    <br />
                    <p class="company">Hello ${adminRecord.name},</p>
                    <p>
                        We're sending you this email because you requested a 
                        password reset. Click on this link to create a new password
                    </p>
                    <br />
                    <div class="btn__link" >
                        <a style="color: white;" href=${link}> Set a new password </a>
                    </div>
                    <br />
                    <p>
                        If you didn't request a password reset, you can ignore this email. You password will not be changed.
                    </p>
                    <br />
                    <p style="text-align: center"><strong>The WebHopers Team</strong></p>
                </div>
               </div>
            </body>
            </html>
        `
    }
    let emailResponse = await sendEmail(EmailData);
    if(emailResponse.startsWith("Mail sent")) {
        await addToken(filter)
    }
    return emailResponse;
}

exports.resetPasswordWithUserId = async (data) => {
    let now = moment().format();

    let filter = {}

    const adminRecords = await getAdmin({_id: data.adminId});

    if(!adminRecords)
        return responseHandler(400, "No record found.");

    if(!(now < moment(adminRecords.token_expire_in).format())) {
        let filter = {}

        filter.adminId = data.adminId;
        filter.conditions = {
            $unset: { token: 1, token_expire_in: 1}
        }

        await addToken(filter)

        return responseHandler(400, "Link has been expired.");
    }

    if(!adminRecords.token)
        return responseHandler(400, "Link has been expired.");

    filter.adminId = data.adminId;

    filter.conditions = {
        $set: {password_hash: bcrypt.hashSync(data.password,10), modified_on: new Date(Date.now())},
        $unset: { token: 1, token_expire_in: 1}
    }

    const response = await addToken(filter);

    if(!response.ok) {
        return responseHandler(400, "Password is not updated.");
    }
    return responseHandler(200, "Successfully updated.");
}

const responseHandler = (sts, msg) => {
    return {
        status: sts,
        message: msg
    }
}

//activate rep same as update only pass active is true
exports.activateRep = async(repId)=>{
    if(!repId) throw new Error("Please provide rep Id");
    let filter = {active:true}
    let repRecord = await updateAdmin(repId,filter);
    return Formatter.RepFormatter(repRecord)
}