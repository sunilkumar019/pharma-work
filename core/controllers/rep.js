//import use cases

const addRep = require("../usecases/rep/addRep")
const deleteRep = require("../usecases/rep/deleteRep")
const getRep = require("../usecases/rep/getReps")
const getSingleRep = require("../usecases/rep/getRep");
const getRepCount = require("../usecases/rep/getRepCount")
const updateRep = require("../usecases/rep/updateReps")
const jwt = require("jsonwebtoken");
const comparaPassword = require("../usecases/rep/comparePassword");

const addRepVisit = require("../usecases/repVisit/addRepVisit");
const getRepVisit = require("../usecases/repVisit/getRepVisits");
//import moment for date formatting
const moment = require("moment");
//import bcrypt for pasword hashing
const bcrypt = require("bcrypt");
const getFranchisee = require("../usecases/franchisee/getFranchisee");


//import get order usecase for generating report
const getOrder = require("../usecases/order/getOrders");
//franchisee controller to get all franchisees
const franchiseeController = require("./franchisee");
//division controller to get all divisions
const divisionController = require("./division");
//company order controller
const company_order = require("./company_order");
//favourite product controller
const favouriteProduct = require("./product");
//order controller
const order = require("./order")

const sendEmail = require('../usecases/Email');
const Redis = require('../lib/RedisDb');

const getAdmin = require("../usecases/admin/getAdmin");
const Validator = require("../lib/Validators");



//Formatter
const Formatter = require("../Formatters/index")

const lodash = require("lodash")
const underscore = require("underscore")


// ->csv to json return
async function convertcsvtojson(filePath) {

    filejson = await csv().fromFile(filePath)
    fs.unlinkSync(filePath);
    return filejson;
}

//Add rep
exports.addRep = async (rep) => {

    if (!rep.franchisee_id) throw new Error('Franchisee Id is Required'); //will changed by auth
    if (!rep.name) throw new Error('Name is Required');
    if (!rep.email) rep.email = '';

    if (!rep.phone) throw new Error('Phone Number is Required');
    let phone = Validator.validatePhone(rep.phone);
    if (typeof phone == "boolean") throw new Error('Invalid Phone number');
    rep.phone = phone;

    if (!rep.address) rep.address = "NA" //throw new Error('rep address is Required');
    if (!rep.dob) rep.dob = null;
    if (!rep.password) throw new Error('Password is Required');
    if (!rep.op_area) rep.op_area = "NA";

    if (!rep.active) rep.active = false;
    if (!rep.is_owner) rep.is_owner = false;
    if (!rep.city) rep.city = "";
    if (!rep.state) rep.state = "";
    if (!rep.aadhar_no) rep.aadhar_no = "";
    let profile_pic = null;
    if (rep.profile_pic) profile_pic = rep.profile_pic
    //hashing password
    let passwordHash = bcrypt.hashSync(rep.password, 10);
    let rep_active = false
    if (rep.active === "true") { rep_active = true }
    else { rep_active = false }

    let newrep = {
        franchisee_id: rep.franchisee_id,
        name: rep.name,
        city: rep.city,
        state: rep.state,
        address: rep.address,
        email: rep.email,
        phone: rep.phone,
        dob: rep.dob,
        profile_pic_url: profile_pic,
        aadhar_no: rep.aadhar_no,
        password_hash: passwordHash,
        is_owner: rep.is_owner,
        op_area: rep.op_area,
        active: rep_active,
        created_on: new Date(Date.now())
    }

    if (newrep.active == false && newrep.is_owner == true) {


        //get admin details
        let adminRecord = await getAdmin();
        delete adminRecord.password_hash;

        let msg = `
            <h3>New Distributor Registered on the App</h3>
            Name: ${rep.name} <br/>
            Email: ${rep.email} <br/>
            Phone: ${rep.phone} <br/>
            Address: ${rep.address}, ${rep.city}, ${rep.state}
        `;

        let EmailData = {
            To: adminRecord.email,
            Subject: "New Distributor Registered on the App at " + moment(new Date(Date.now())).format("LLL"),
            Body: msg
        }

        await sendEmail(EmailData)
    }

    let savedrep = await addRep(newrep);

    delete savedrep.__v
    delete savedrep.modified_on
    delete savedrep.created_on
    delete savedrep.active
    delete savedrep.password_hash

    return savedrep;
}

const csv = require('csvtojson');
const fs = require('fs');
const searchReps = require("../usecases/rep/searchReps");

exports.bulkUpload = async (productFile) => {

    /**get all reps */
    let repRecordstmp = await exports.getRep({ is_owner: true });
    let repRecordsData = repRecordstmp.map(it => {
        return Formatter.RepFormatter(it)
    });
    /** get all franchisees */
    let franchiseeRecordtmp = await franchiseeController.getFranchisee({});
    let franchiseeRecordData = franchiseeRecordtmp.map(it => {
        return Formatter.franchiseeFormatter(it);
    });
    /** get all divisions */
    let divisionsRecordData = await divisionController.getDivision({});

    fileJsonData = await convertcsvtojson('./core/uploads/reps/' + productFile);
    let errorData = [];
    let repData = [];
    let franchiseeData = [];
    for (let i = 0; i < fileJsonData.length; i++) { //tmp is i+2 because in excel rows start from 1
        let tmp = i + 2;

        /****************distributor name */
        if (fileJsonData[i].name === undefined || fileJsonData[i].name == "")
            errorData.push("Distributor Name Cannot be Empty. Error at Row NO: " + tmp)
        else
            repData.push({ name: fileJsonData[i].name });
        /****************distributor email */
        if (fileJsonData[i].email === undefined || fileJsonData[i].email == "")
            errorData.push("Distributor Email Cannot be Empty. Error at Row NO: " + tmp)
        else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(fileJsonData[i].email)))
            errorData.push("Distributor Email Is not Valid. Error at Row NO: " + tmp)
        else if (repRecordsData.some(reps => reps.email === fileJsonData[i].email))
            errorData.push("Distributor Email already Exists. Error at Row NO: " + tmp)
        else
            repData[i].email = fileJsonData[i].email;


        /****************distributor phone */
        if (fileJsonData[i].phone === undefined || fileJsonData[i].phone == "")
            errorData.push("Distributor Phone Cannot be Empty. Error at Row NO: " + tmp)
        else
            repData[i].phone = fileJsonData[i].phone;

        /****************distributor password */
        if (fileJsonData[i].password === undefined || fileJsonData[i].password == "")
            errorData.push("Distributor password Cannot be Empty. Error at Row NO: " + tmp)
        else
            repData[i].password = fileJsonData[i].password;

        /****************distributor address */
        if (fileJsonData[i].address != undefined || fileJsonData[i].address != "")
            repData[i].address = fileJsonData[i].address;

        /****************distributor aadhar_no */
        if (fileJsonData[i].aadhar_no != undefined || fileJsonData[i].aadhar_no != "")
            repData[i].aadhar_no = fileJsonData[i].aadhar_no;

        /****************distributor city */
        if (fileJsonData[i].city != undefined || fileJsonData[i].city != "")
            repData[i].city = fileJsonData[i].city;

        /****************distributor state */
        if (fileJsonData[i].state != undefined || fileJsonData[i].state != "")
            repData[i].state = fileJsonData[i].state;

        /****************distributor op area */
        if (fileJsonData[i].op_area) repData[i].op_area = fileJsonData[i].op_area;

        repData[i].active = true;
        repData[i].is_owner = true;


        /****************Firm name */
        if (fileJsonData[i].firm_name === undefined || fileJsonData[i].firm_name == "")
            errorData.push("Distributor firm_name Cannot be Empty. Error at Row NO: " + tmp)
        else
            franchiseeData.push({ name: fileJsonData[i].firm_name });
        /****************Firm phone */
        // if(fileJsonData[i].firm_phone === undefined || fileJsonData[i].firm_phone == "")
        //     errorData.push("Distributor firm_phone Cannot be Empty. Error at Row NO: "+tmp)
        // else
        //     franchiseeData[i].phone = fileJsonData[i].firm_phone;
        if (fileJsonData[i].firm_phone === undefined || fileJsonData[i].firm_phone == "")
            franchiseeData[i].phone = "NA";
        else
            franchiseeData[i].phone = fileJsonData[i].firm_phone;
        /****************Firm email */
        // if(fileJsonData[i].firm_email === undefined || fileJsonData[i].firm_email == "")
        //     errorData.push("Distributor firm_email Cannot be Empty. Error at Row NO: "+tmp)
        // else if(franchiseeRecordData.some(firm => firm.email === fileJsonData[i].firm_email))
        //     errorData.push("Distributor firm_email already exists. Error at Row NO: "+tmp)
        // else
        //     franchiseeData[i].email = fileJsonData[i].firm_email;
        if (fileJsonData[i].firm_email === undefined || fileJsonData[i].firm_email == "")
            franchiseeData[i].email = "NA"
        else
            franchiseeData[i].email = fileJsonData[i].firm_email;
        /****************Firm address */
        if (fileJsonData[i].firm_address === undefined || fileJsonData[i].firm_address == "")
            //errorData.push("Distributor firm_address Cannot be Empty. Error at Row NO: "+tmp)
            franchiseeData[i].address = "NA"
        else
            franchiseeData[i].address = fileJsonData[i].firm_address;
        /****************Firm state */
        if (fileJsonData[i].firm_state === undefined || fileJsonData[i].firm_state == "")
            //errorData.push("Distributor firm_state Cannot be Empty. Error at Row NO: "+tmp)
            franchiseeData[i].state = "NA"
        else
            franchiseeData[i].state = fileJsonData[i].firm_state;
        /****************Firm district */
        if (fileJsonData[i].firm_district === undefined || fileJsonData[i].firm_district == "")
            //errorData.push("Distributor firm_district Cannot be Empty. Error at Row NO: "+tmp)
            franchiseeData[i].district = "NA"
        else
            franchiseeData[i].district = fileJsonData[i].firm_district;
        /****************Firm gst */
        if (fileJsonData[i].gst_number) franchiseeData[i].gst_number = fileJsonData[i].gst_number;
        /****************Firm drug */
        if (fileJsonData[i].drug_license) franchiseeData[i].drug_license = fileJsonData[i].drug_license;

        /****************Firm acc no */
        if (fileJsonData[i].bank_acc_no) franchiseeData[i].bank_acc_no = fileJsonData[i].bank_acc_no;
        /****************Firm ifsc */
        if (fileJsonData[i].bank_ifsc) franchiseeData[i].bank_ifsc = fileJsonData[i].bank_ifsc;
        /****************Firm bank name */
        if (fileJsonData[i].bank_name) franchiseeData[i].bank_name = fileJsonData[i].bank_name;
        /****************Firm payee name */
        if (fileJsonData[i].bank_payee_name) franchiseeData[i].bank_payee_name = fileJsonData[i].bank_payee_name;


        franchiseeData[i].active = true;
        // delete fileJsonData[i].Name;
        // delete fileJsonData[i].Email;

        /**for divisions */
        if (fileJsonData[i].divisions) {
            let divisionsFromFile = fileJsonData[i].divisions.split(",");
            for (let p = 0; p < divisionsFromFile.length; p++) {
                let result = divisionsRecordData.find(({ name }) => name == divisionsFromFile[p]);
                if (result) {
                    franchiseeData[i].divisions = (franchiseeData[i].divisions && [...franchiseeData[i].divisions, result.id]) || [result.id]
                }
            }
        }

    }
    if (errorData.length > 0) {
        throw new Error(errorData);
    } else {
        let Repinsertionerror = [];

        for (let i = 0; i < repData.length; i++) {
            let franchiseeRes = await franchiseeController.addFranchisee(franchiseeData[i]);

            repData[i].franchisee_id = franchiseeRes._id;
            repinsertionRes = await exports.addRep(repData[i]);
        }

        if (Repinsertionerror.length > 0)
            throw new Error(Repinsertionerror);
        else
            return { message: "List uploaded" }

    }
}

//get reps
exports.getRep = async (repprops) => {
    let filter = {}
    filter.skip = 0;
    filter.limit = 1000;


    if (repprops.skip) filter.skip = repprops.skip;
    if (repprops.limit) filter.limit = repprops.limit;
    if (repprops.franchisee_id) filter.franchisee_id = repprops.franchisee_id;

    if (repprops.id) filter._id = repprops.id;


    if (repprops.name) filter.name = {
        $regex: repprops.name,
        '$options': 'i'
    };

    if (repprops.city) filter.city = repprops.city;

    if (repprops.state) filter.state = repprops.state;

    if (repprops.email) filter.email = repprops.email;

    if (repprops.phone) filter.phone = repprops.phone;

    if (repprops.active == true || repprops.active == false) filter.active = repprops.active;

    if (repprops.is_owner == true || repprops.is_owner == false) filter.is_owner = repprops.is_owner;
    else filter.is_owner = false;

    if (repprops.search) filter.search = repprops.search;

    if (repprops.searchBy) filter.searchBy = repprops.searchBy;

    if (repprops.divisions) {
        let params = [];
        if (Array.isArray(repprops.divisions)) params = repprops.divisions;
        else params = [repprops.divisions]
        let franchiseeRecords = await getFranchisee({ divisions: { $in: params } });

        let franchiseeIds = franchiseeRecords.map(it => it._id);

        filter.franchisee_id = {
            $in: franchiseeIds
        }
    }

    if (repprops.division_id) {
        let params = [];
        if (Array.isArray(repprops.division_id)) params = repprops.division_id;
        else params = [repprops.division_id]
        let franchiseeRecords = await getFranchisee({ divisions: { $in: params } });

        let franchiseeIds = franchiseeRecords.map(it => it._id);

        filter.franchisee_id = {
            $in: franchiseeIds
        }
    }

    let repRecords = await getRep(filter);

    if (!repRecords) return null;
    repRecords = repRecords.map(it => {
        return Formatter.RepFormatter(it)
    })


    return repRecords;
}

//search rep account and send otp to mail
exports.searchAccountOfRep = async (repprops) => {
    let filter = {};

    filter.skip = 0;
    filter.limit = 1;

    if (repprops.email) {
        if (!Validator.validateEmail(repprops.email)) throw new Error("Invalid Email");
        filter.email = repprops.email;
    }
    if (repprops.phone) {
        let phone = Validator.validatePhone(repprops.phone);
        if (typeof phone == "boolean") throw new Error('Invalid Phone number');
        filter.phone = phone;
    }


    let data = null;
    let repRecords = await getRep(filter);
    if (repRecords.length > 0) {
        data = {
            id: repRecords[0]._id,
            name: repRecords[0].name,
            email: repRecords[0].email
        };
        //generates random password
        let password = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
        let currTime = new Date();
        let EmailData = {
            To: data.email,
            Subject: `OTP for Pharma App password change request at ${moment(currTime).format("LLL")}`,
            Body: `Hello ${data.name}!, Your OTP for Pharma App is ${password}. This OTP is valid upto 15 minutes.`
        }
        await Redis.saveData(data.id, password);

        let emailResponse = await sendEmail(EmailData)
        return data;
    }
    else {
        throw new Error("No Account Found ")
    }



}

// verify OTP
exports.verifyOtp = async (key, otp) => {
    let data = await Redis.getData(key);
    if (data == null) return false;
    else if (data.toString() == otp.toString()) {
        await Redis.saveData(key, "session", 120);
        return true;
    }
    else return false;
}

const isEmail = (emailOrPhone) => {
    let re = /\S+@\S+\.\S+/;
    return re.test(emailOrPhone);
}

exports.repLogin = async (repprops) => {
    let repRecord = [];
    const emailOrPhone = repprops.emailOrPhone
    if(isEmail(emailOrPhone)){
        repRecord = await getRep({ email: emailOrPhone })
    } else {
        repRecord = await getRep({ phone: String(emailOrPhone).substr(emailOrPhone.length - 10) })
    }

     if (repRecord.length == 0)
        return { Error: "Invalid Credentials" }
    const PasswordMatch = await bcrypt.compare(repprops.password, repRecord[0].password_hash);
    if (!PasswordMatch)
        return { Error: "Invalid Credentials" }
    if (repRecord[0].active == false)
        return { Error: "Your account is not activated yet, Please contact admin for account activation" }

    if (repprops.device_token)
        await exports.updateRep({ id: repRecord[0]._id, device_token: repprops.device_token })

    const token = jwt.sign({
        repId: repRecord[0]._id,
        is_owner: repRecord[0].is_owner,
        franchiseeId: repRecord[0].franchisee_id._id
    },
        "secret",
        {
            expiresIn: (86400 * 30)
        }
    );

    repRecord = {
        token: token,
        user: Formatter.RepFormatter(repRecord[0])
    }
    return repRecord;
}


exports.logout = async (repId) => {

    await updateRep(repId, { device_token: null });
    return true;
}

//get individual rep
exports.getSingleRep = async (repprops) => {
    let filter = {}
    if (repprops.id) filter._id = repprops.id;

    let repRecord = await getSingleRep(filter);

    return Formatter.RepFormatter(repRecord)
}

//update rep
exports.updateRep = async (repprops) => {
    let repId = repprops.id;
    if (!repprops.id) throw new Error("Please provide rep Id");
    let filter = {}
    if (repprops.name) filter.name = repprops.name;
    if (repprops.city) filter.city = repprops.city;
    if (repprops.state) filter.state = repprops.state;
    if (repprops.address) filter.address = repprops.address;
    if (repprops.email || repprops.email === '') filter.email = repprops.email;

    if (repprops.phone) {
        let phone = Validator.validatePhone(repprops.phone);
        if (typeof phone == "boolean") throw new Error('Invalid Phone number');
        filter.phone = phone;
    }
    if (repprops.dob != null && repprops.dob != "null" && repprops.dob != "NA") {
        filter.dob = repprops.dob;
    }

    if (repprops.op_area) filter.op_area = repprops.op_area;

    if (repprops.joined_on) filter.joined_on = repprops.joined_on;
    if (repprops.active) filter.active = repprops.active;
    if (repprops.is_owner) filter.is_owner = repprops.is_owner;
    if (repprops.aadhar_no) filter.aadhar_no = repprops.aadhar_no;
    if (repprops.profile_pic) filter.profile_pic_url = repprops.profile_pic;
    if (repprops.device_token) filter.device_token = repprops.device_token;
    if (repprops.password) filter.password_hash = bcrypt.hashSync(repprops.password, 10);

    filter.modified_on = new Date(Date.now());
    let repRecord = await updateRep(repId, filter);
    return Formatter.RepFormatter(repRecord)
}

exports.changePassword = async (repprops) => {
    let repId = repprops.id;
    if (!repprops.id) throw new Error("Please provide rep Id");
    if (!repprops.oldPassword) throw new Error("Please provide Old Password");
    if (!repprops.newPassword) throw new Error("Please provide New Password");

    let id = repprops.id;
    let oldPassword = repprops.oldPassword;
    let response = await comparaPassword(id, oldPassword);
    if (!response) throw new Error("Password Not Matched!")

    let filter = {}
    filter.password_hash = bcrypt.hashSync(repprops.newPassword, 10);
    filter.modified_on = new Date(Date.now());
    let repRecord = await updateRep(repId, filter);
    return Formatter.RepFormatter(repRecord)
}

//reset password if of rep
exports.resetPassword = async (repprops) => {


    let repId = repprops.id;
    if (!repprops.id) throw new Error("Please provide rep Id");
    if (!repprops.password) throw new Error("Please provide rep New Password");

    if (repprops.fromOtp) {
        let data = await Redis.getData(repId);
        if (data == null) return false;
        else if (data.toString() != "session") return false;
    }

    let filter = {}
    //hashing password
    let passwordHash = bcrypt.hashSync(repprops.password, 10);
    filter.password_hash = passwordHash
    filter.modified_on = new Date(Date.now());

    let repRecord = await updateRep(repId, filter);
    return Formatter.RepFormatter(repRecord)
}

//activate rep same as update only pass active is true
exports.activateRep = async (repId) => {
    if (!repId) throw new Error("Please provide rep Id");
    let filter = { active: true }
    let repRecord = await updateRep(repId, filter);
    return Formatter.RepFormatter(repRecord)
}
//deactivate rep same as update only pass active is true
exports.deactivateRep = async (repId) => {
    if (!repId) throw new Error("Please provide rep Id");
    let filter = { active: false }
    let repRecord = await updateRep(repId, filter);
    return Formatter.RepFormatter(repRecord)
}

//deleteRep
exports.deleteRep = async (repId) => {

    if (!repId) throw new Error("Please provide rep Id");

    let repInfo = await exports.getRep({ id: repId });
    if (repInfo.length > 0) {
        let singleRep = repInfo[0];
        if (singleRep.is_owner == true) {
            let allMrs = await exports.getRep({ franchisee_id: singleRep.franchisee_id, is_owner: false });
            for (let i = 0; i < allMrs.length; i++) {
                let mr = allMrs[i];
                await exports.deleteRep(mr.id);
            }
        }
    }

    ////////////////////////////////////////////////////////////////////
    let CompanyordersTemp = await company_order.getOrder({ rep_id: repId });
    if (CompanyordersTemp.length != 0)
        throw new Error("Unable to Delete Distributor, Because It is Linked with Some Company Order Detail(s)")

    let FavouriteProductTemp = await favouriteProduct.getFavProduct({ rep_id: repId })
    if (FavouriteProductTemp.length > 0)
        throw new Error("Unable to Delete Distributor, Because It is Linked with Some Favourite Product(s)")

    let OrderTemp = await order.getOrder({ rep_id: repId })
    if (OrderTemp.length != 0)
        throw new Error("Unable to Delete Distributor, Because It is Linked with Some Customer Order Detail(s)")

    let RepVisitTemp = await exports.getRepVisit({ rep_id: repId });
    if (RepVisitTemp.length != 0)
        throw new Error("Unable to Delete Distributor, Because It is Linked with Some Rep Visit(s)");


    ///////////////////////////////////////////////////////////////////////
    return await deleteRep(repId);
}

//get rep count
exports.getRepCount = async (repprops) => {
    let filter = {}
    if (repprops.franchisee_id) filter.franchisee_id = repprops.franchisee_id;
    if (repprops.is_owner == true || repprops.is_owner == false) filter.is_owner = repprops.is_owner;

    let repRecords = await getRepCount(filter);
    return { count: repRecords - 1 };
}

exports.distributorsCount = async () => {
    let filter = {}
    filter.is_owner = true;
    // filter.active = true;
    let repRecords = await getRepCount(filter);
    return { count: repRecords };
}


//get report of rep by dates
exports.getReport = async (repprops) => {

    let filter = {}
    let result = {};

    let repStartDate = moment(repprops.startDate).startOf('day');
    let repEndDate = moment(repprops.endDate).endOf('day');

    filter.created_on = { $gte: repStartDate, $lte: repEndDate };
    filter.franchisee_id = repprops.franchisee_id;
    if (repprops.rep_id) filter.rep_id = repprops.rep_id;

    let repVisits = await getRepVisit(filter);
    let repOrders = await getOrder(filter);

    result.totalVisitsCount = repVisits.length;
    result.totalOrdersCount = repOrders.length;

    repVisits = repVisits.map(it => {

        return {
            id: it._id,
            customer_id: it.customer_id._id,
            customer_name: it.customer_id.name,
            customer_email: it.customer_id.email,
            customer_phone: it.customer_id.phone,
            customer_profession: it.customer_id.profession,
            place: it.place,
            remark: it.remark,
            time: moment(it.time).format("LLL"),
            latitude: it.latitude || null,
            longitude: it.longitude || null,
            created_on: moment(it.created_on).format("LLL"),
            rep_id: it.rep_id._id,
            rep_name: it.rep_id.name
        }
    })

    let Visits = underscore.chain(repVisits).groupBy("rep_id").pairs().map(function (currentItem) { return underscore.object(underscore.zip(["rep_id", "reps"], currentItem)); }).value();

    Visits = Visits.map(it => {
        return {

            id: it.reps[0].rep_id + "",
            name: it.reps[0].rep_name,
            visits: it.reps.length
        }
    })

    repOrders = repOrders.map(it => {

        return {
            id: it._id,
            customer_id: it.customer_id._id,
            customer_name: it.customer_id.name,
            rep_id: it.rep_id._id,
            rep_name: it.rep_id.name,
            // franchisee_id: it.franchisee_id._id,
            // franchisee_name: it.franchisee_id.name,
            created_on: moment(it.created_on).format("LLL"),

            orderlist: it.orderlist.map(item => {
                item = item.toObject()

                let images = item.product_id.images;
                if (images.length == 0) {
                    images = null;
                } else {
                    images.forEach(img => {
                        delete img._id;
                        img.url = `${process.env.BASE_URL}${img.url}`
                    })
                }

                return {
                    product: {
                        id: item.product_id._id,
                        name: item.product_id.name,
                        price: item.product_id.price,
                        description: item.product_id.description,
                        images,
                        min_order_qty: item.product_id.min_order_qty,
                        division_id: item.product_id.division_id._id,
                        division_name: item.product_id.division_id.name,
                        type_id: item.product_id.type_id._id,
                        type_name: item.product_id.type_id.name,
                        category_id: item.product_id.category_id._id,
                        category_name: item.product_id.category_id.name,
                        created_on: moment(item.product_id.created_on).format("LLL"),
                        modified_on: moment(item.product_id.modified_on).format("LLL"),
                    },
                    quantity: item.quantity
                }
            })
        }
    })

    let Orders = underscore.chain(repOrders).groupBy("rep_id").pairs().map(function (currentItem) { return underscore.object(underscore.zip(["rep_id", "orders"], currentItem)); }).value();

    Orders = Orders.map(it => {
        return {
            id: it.orders[0].rep_id + "",
            name: it.orders[0].rep_name,
            orders: it.orders.length
        }
    })

    let repIDObject = {}
    let rs = Visits.concat(Orders)
    rs.forEach(it => {
        if (repIDObject[it.id]) {
            if (!repIDObject[it.id]['orders']) {
                repIDObject[it.id]['orders'] = it.orders
            } else {
                repIDObject[it.id]['visits'] = it.visits
            }
        } else {
            repIDObject[it.id] = it
        }
    })
    repIDObject = Object.values(repIDObject)

    return repIDObject;
}

/****************Rep visit controller functions******************** */

exports.addRepVisit = async (visit) => {

    if (!visit.customer_id) throw new Error('customer Id is Required');
    if (!visit.place) throw new Error('Meeting place is Required');
    if (!visit.remark) throw new Error('remark is Required');
    if (!visit.time) throw new Error('time (hh:mm) is Required');
    // if (!visit.latitude) throw new Error('Latitude is Required');
    // if (!visit.longitude) throw new Error('Longitude is Required');
    // if (!visit.map_address) throw new Error('map address is Required');

    let time = visit.time.split(":");
    let hrs = time[0];
    let mins = time[1];
    let currentDate = new Date();
    var meetingTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hrs, mins);

    var visitProducts = null;
    if (visit.products) {
        if (typeof (visit.products) == "string")
            visitProducts = JSON.parse(visit.products)
        else
            visitProducts = visit.products
    }


    let newvisit = {
        customer_id: visit.customer_id,
        place: visit.place,
        remark: visit.remark,
        time: meetingTime,
        rep_id: visit.rep_id,
        franchisee_id: visit.franchisee_id,
        products: visitProducts,
        latitude: visit.latitude || null,
        longitude: visit.longitude || null,
        created_on: new Date(Date.now())
    }
    let savedrepVisit = await addRepVisit(newvisit);

    delete savedrepVisit.__v
    delete savedrepVisit.created_on
    delete savedrepVisit.franchisee_id
    return savedrepVisit;
}


//{"OrderDateTime":{ $gte:ISODate("2019-02-10"), $lt:ISODate("2019-02-21") }
exports.getRepVisit = async (repprops) => {

    let repVisits = await getRepVisit(repprops);
    if (!repVisits)
        return null;

    repVisits = repVisits.map(it => {
        let tmpProducts = [];
        if (it.products) {
            tmpProduct = (it.products).forEach(pro => {
                tmpProducts.push(Formatter.ProductFormatter(pro));
            })
        }
        return {
            id: it._id,
            customer_id: it.customer_id._id,
            customer_name: it.customer_id.name,
            customer_email: it.customer_id.email,
            customer_phone: it.customer_id.phone,
            customer_profession: it.customer_id.profession,
            products: tmpProducts,
            place: it.place,
            remark: it.remark,
            time: moment(it.time).format("LLL"),
            latitude: it.latitude || null,
            longitude: it.longitude || null,
            created_on: moment(it.created_on).format("LLL"),
        }
    })
    return repVisits;
}

exports.repSearch = async (repSearchFilter) => {
    let filter = {}
    if (repSearchFilter) filter = repSearchFilter;
    let repRecords = await searchReps(filter);


    if (!repRecords) return null;
    repRecords = repRecords.map(it => {
        return Formatter.RepFormatter(it)
    })

    return repRecords;
}

exports.deleteMr = async (props) => {
    return await deleteRep(props.id)
}

exports.getRepVisitAnalysis = async (props) => {

    let filters = {};
    filters.$or = [];

    filters.skip = 0;
    filters.limit = 200;

    if (props.skip) filters.skip = props.skip;
    if (props.limit) filters.limit = props.limit;


    if (props.franchisee_id) filters.franchisee_id = props.franchisee_id;
    if (props.id) filters._id = props.id;

    if (props.from) {
        if (props.to) {
            filters.time = { $gte: props.from, $lt: props.to }
        } else {
            filters.time = { $gte: props.from, $lt: new Date() }
        }
    }

    if (props.products) {
        let productFilter = [];
        if (Array.isArray(props.products)) {
            (props.products).forEach(element => {
                productFilter.push(element)
            })
        } else {
            productFilter.push(props.products)
        }

        filters.products = { $in: productFilter };
    }

    if (props.customer_id) {
        if (Array.isArray(props.customer_id)) {
            (props.customer_id).forEach(element => {
                filters.$or.push({ customer_id: element })
            });
        } else {
            filters.customer_id = props.customer_id
        }
    }

    if (props.rep_id) {
        if (Array.isArray(props.rep_id)) {
            (props.rep_id).forEach(element => {
                filters.$or.push({ rep_id: element })
            })
        } else {
            filters.rep_id = props.rep_id;
        }
    }
    if (filters.$or.length == 0) delete filters.$or;
    let repVisits = await getRepVisit(filters);
    if (!repVisits)
        return null;

    repVisits = repVisits.map(it => {
        let tmpProducts = null;
        if (it.products) {
            tmpProducts = (it.products).map(product => {

                return {
                    id: product._id,
                    name: product.name,
                    description: product.description,
                    division_name: product.division_id.name,
                    type_name: product.type_id.name,
                    category_name: product.category_id.name
                }
            })
        }

        return {
            id: it._id,

            customer_id: it.customer_id._id,
            customer_name: it.customer_id.name,
            customer_phone: it.customer_id.phone,
            customer_email: it.customer_id.email,
            customer_profession: it.customer_id.profession,
            customer_working_place: it.customer_id.working_place,


            rep_id: it.rep_id._id,
            rep_name: it.rep_id.name,
            rep_phone: it.rep_id.phone,
            rep_op_area: it.rep_id.op_area,

            products: tmpProducts,
            place: it.place,
            remark: it.remark,
            time: moment(it.time).format("LLL"),
            latitude: it.latitude || null,
            longitude: it.longitude || null,

            created_on: moment(it.created_on).format("LLL"),
        }
    })

    //
    // ─── CUSTOMER VIEW FOR PRODUCT WISE START ────────────────────────────────────────────────────────
    //

    let finalProductCustomersResponse = [];
    let groupByCustomerstmp = groupBy('customer_id');
    let customersResponseTempp = Object.values(groupByCustomerstmp(repVisits));

    customersResponseTempp.map(it => {
        let customerInfo = {
            id: it[0].customer_id,
            name: it[0].customer_name,
            phone: it[0].customer_phone,
            email: it[0].customer_email,
            profession: it[0].customer_profession,
            working_place: it[0].customer_working_place
        }
        let groupByMRs = groupBy('rep_id');
        let totalProductShownCount = 0;
        let mrstempRes = [];
        Object.values(groupByMRs(it)).map(rep => {
            let mrInfo = {
                id: rep[0].rep_id,
                name: rep[0].rep_name,
                phone: rep[0].rep_phone,
                op_area: rep[0].rep_op_area
            }
            let otherInfo = rep.map(other => {
                return {
                    id: other.id,
                    products: other.products,
                    place: other.place,
                    remark: other.remark,
                    time: other.time,
                    latitude: other.latitude || null,
                    longitude: other.longitude || null,
                    created_on: other.created_on
                }
            })
            totalProductShownCount += otherInfo.length;
            mrstempRes.push({ mr_info: mrInfo, visits_count: otherInfo.length, data_by_visit: otherInfo });
        })
        finalProductCustomersResponse.push({ customer_info: customerInfo, total_mrs_count: mrstempRes.length, products_shown_count: totalProductShownCount, mrs: mrstempRes });
    })

    //
    // ─── CUSTOEMER VIEW FOR PRODUCT WISE END ─────────────────────────────────────────────────────────
    //

    //
    // ─── MR VIEW PRODUCT WISE START ──────────────────────────────────────────────────────────────
    //

    let finalProductRepsResponse = [];
    let groupByProductReps = groupBy('rep_id');
    let repsResponseTempp = Object.values(groupByProductReps(repVisits));

    repsResponseTempp.map(it => {
        let repInfo = {
            id: it[0].rep_id,
            name: it[0].rep_name,
            phone: it[0].rep_phone,
            op_area: it[0].rep_op_area
        }
        let groupByCustomer = groupBy('customer_id');
        let totalProductShownCount = 0;
        let customerstempRes = [];
        Object.values(groupByCustomer(it)).map(cust => {
            let customerInfo = {
                id: cust[0].customer_id,
                name: cust[0].customer_name,
                phone: cust[0].customer_phone,
                email: it[0].customer_email,
                profession: it[0].customer_profession,
                working_place: cust[0].customer_working_place
            }
            let otherInfo = cust.map(other => {
                return {
                    id: other.id,
                    products: other.products,
                    place: other.place,
                    remark: other.remark,
                    time: other.time,
                    latitude: other.latitude || null,
                    longitude: other.longitude || null,
                    created_on: other.created_on
                }
            })
            totalProductShownCount += otherInfo.length;
            customerstempRes.push({ customer_info: customerInfo, visits_count: otherInfo.length, data_by_visit: otherInfo });
        })
        finalProductRepsResponse.push({ mr_info: repInfo, mr_to_customers_count: customerstempRes.length, customers: customerstempRes });
    })

    //
    // ─── MR VIEW PRODUCT WISE ENDS ───────────────────────────────────────────────────────────────
    //



    //
    // ─── CUSTOMER VIEW START ────────────────────────────────────────────────────────
    //

    let finalCustomersResponse = [];
    let groupByCustomers = groupBy('customer_id');
    let customersResponseTemp = Object.values(groupByCustomers(repVisits));

    customersResponseTemp.map(it => {
        let customerInfo = {
            id: it[0].customer_id,
            name: it[0].customer_name,
            phone: it[0].customer_phone,
            email: it[0].customer_email,
            profession: it[0].customer_profession,
            working_place: it[0].customer_working_place
        }
        let groupByMRs = groupBy('rep_id');
        let mrstempRes = [];
        Object.values(groupByMRs(it)).map(rep => {
            let mrInfo = {
                id: rep[0].rep_id,
                name: rep[0].rep_name,
                phone: rep[0].rep_phone,
                op_area: rep[0].rep_op_area
            }
            let productsInfotmp = [];
            let otherInfo = rep.map(other => {
                let tmporaryProducts = other.products;
                if (tmporaryProducts)
                    tmporaryProducts.forEach(product => {
                        productsInfotmp.push(product)
                    })
                return {
                    id: other.id,
                    products: other.products,
                    place: other.place,
                    remark: other.remark,
                    time: other.time,
                    latitude: other.latitude || null,
                    longitude: other.longitude || null,
                    created_on: other.created_on
                }
            })
            const key = 'id';
            let uniqueProducts = productsInfotmp.reduce((acc, o) => (acc[o.id] = (acc[o.id] || 0) + 1, acc), {});
            let responseProducts = [...new Map(productsInfotmp.map(item => [item[key], item])).values()];
            responseProducts.forEach(element => {
                element.count = uniqueProducts[element.id]
            })

            mrstempRes.push({ mr_info: mrInfo, mr_to_customer_visit_count: otherInfo.length, products_count: responseProducts.length, products: responseProducts, data_by_visit: otherInfo });
        })
        finalCustomersResponse.push({ customer_info: customerInfo, customer_to_mr_count: mrstempRes.length, mrs: mrstempRes });
    })

    //
    // ─── CUSTOEMER VIEW END ─────────────────────────────────────────────────────────
    //


    //
    // ─── MR VIEW START ──────────────────────────────────────────────────────────────
    //

    let finalRepsResponse = [];
    let groupByReps = groupBy('rep_id');
    let repsResponseTemp = Object.values(groupByReps(repVisits));

    repsResponseTemp.map(it => {
        let repInfo = {
            id: it[0].rep_id,
            name: it[0].rep_name,
            phone: it[0].rep_phone,
            op_area: it[0].rep_op_area
        }
        let groupByCustomer = groupBy('customer_id');
        let customerstempRes = [];
        Object.values(groupByCustomer(it)).map(cust => {
            let customerInfo = {
                id: cust[0].customer_id,
                name: cust[0].customer_name,
                phone: cust[0].customer_phone,
                email: it[0].customer_email,
                profession: it[0].customer_profession,
                working_place: cust[0].customer_working_place
            }
            let productsInfotmp = [];
            let otherInfo = cust.map(other => {
                let tmporaryProducts = other.products;
                if (tmporaryProducts)
                    tmporaryProducts.forEach(product => {
                        productsInfotmp.push(product)
                    })
                return {
                    id: other.id,
                    products: other.products,
                    place: other.place,
                    remark: other.remark,
                    time: other.time,
                    latitude: other.latitude || null,
                    longitude: other.longitude || null,
                    created_on: other.created_on
                }
            })
            const key = 'id';
            let uniqueProducts = productsInfotmp.reduce((acc, o) => (acc[o.id] = (acc[o.id] || 0) + 1, acc), {});
            let responseProducts = [...new Map(productsInfotmp.map(item => [item[key], item])).values()];
            responseProducts.forEach(element => {
                element.count = uniqueProducts[element.id]
            })

            customerstempRes.push({ customer_info: customerInfo, visits_count: otherInfo.length, products_count: responseProducts.length, products: responseProducts, data_by_visit: otherInfo });
        })
        finalRepsResponse.push({ mr_info: repInfo, mr_to_customer_visit_count: customerstempRes.length, customers: customerstempRes });
    })

    //
    // ─── MR VIEW ENDS ───────────────────────────────────────────────────────────────
    //

    if (props.view) {
        if (props.view == "customer") {
            return finalCustomersResponse;
        }
        if (props.view == "singlecustomer") {
            if (finalCustomersResponse.length > 0)
                return finalCustomersResponse[0].mrs;
            else
                return []
        }
        if (props.view == "mr") {
            return finalRepsResponse;
        }
        if (props.view == "singlemr") {
            if (finalRepsResponse.length > 0)
                return finalRepsResponse[0].customers;
            else
                return []
        }
        if (props.view == "productCustomer") {
            return finalProductCustomersResponse;
        }
        if (props.view == "productCustomersingle") {
            if (finalProductCustomersResponse.length > 0)
                return finalProductCustomersResponse[0].mrs;
            else
                return []
        }
        if (props.view == "productMr") {
            return finalProductRepsResponse;
        }
        if (props.view == "productMrsingle") {
            if (finalProductRepsResponse.length > 0)
                return finalProductRepsResponse[0].customers;
            else
                return []
        }
    }

    return {
        customer_view: finalCustomersResponse,
        mr_view: finalRepsResponse,
        product_to_customer_view: finalProductCustomersResponse,
        Product_to_mr_view: finalProductRepsResponse
    }
}


const groupBy = key => array =>
    array.reduce((objectsByKeyValue, obj) => {
        const value = obj[key];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
    }, {});
