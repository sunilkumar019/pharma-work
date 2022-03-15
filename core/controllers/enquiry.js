//import use cases
const addEnquiry = require("../usecases/enquiry/addEnquiry");
const getEnquiry = require("../usecases/enquiry/getEnquiry");
const deleteEnquiry = require("../usecases/enquiry/deleteEnquiry");
const countEnquiry = require("../usecases/enquiry/countEnquiry");

const getAdmin = require("../usecases/admin/getAdmin");

const sendEmail = require("../usecases/Email");
const Validator = require("../lib/Validators");
//import moment for date formatting
const moment = require("moment");
const searchEnquiryWeb = require("../usecases/enquiry/searchEnquiryWeb");


exports.addEnquiry = async(enquiry) => {

    if (!enquiry.name) throw new Error('Name is Required');
    if (!enquiry.phone) throw new Error('Phone Number is Required');
    let phone = Validator.validatePhone(enquiry.phone);
    if(typeof phone == "boolean") throw new Error('Invalid Phone number');
    enquiry.phone = phone;

    if(enquiry.email)
        if(!Validator.validateEmail(enquiry.email)) throw new Error("Invalid Email");

    if(enquiry.message){
        if(enquiry.message.length >300) throw new Error("Message is too Long");
    }

    let newEnquiry = {
        name: enquiry.name,
        phone: enquiry.phone,
        email: enquiry.email? enquiry.email : null,
        message: enquiry.message ? enquiry.message : null,
        created_on: new Date(Date.now())
    }
    let savedEnquiry = await addEnquiry(newEnquiry);
    

    let message = `<h3>Enquiry from App</h3>
        <h3>Name: ${savedEnquiry.name}</h3>
        <h3>Phone: ${savedEnquiry.phone}</h3>
        <h3>Email: ${savedEnquiry.email ? savedEnquiry.email : ""}</h3>
        <h3>Message: ${savedEnquiry.message ? savedEnquiry.message : ""}</h3>
        `;

     //get admin details
     let adminRecord = await getAdmin();
     delete adminRecord.password_hash;
 
    let EmailData = {
        To: adminRecord.email,
        Subject: "Enquiry Received from App at " + moment(new Date(Date.now())).format("LLL"),
        Body: message
    }

    let emailResponse = await sendEmail(EmailData)

    return true;
}

exports.getEnquiry = async(enquiryProps) => {
    let filter = {}
    if (enquiryProps.id) filter._id = enquiryProps.id;
    if (enquiryProps.name) filter.name = enquiryProps.name;
    if (enquiryProps.phone) filter.phone = enquiryProps.phone;
    if (enquiryProps.email) filter.email = enquiryProps.email;
    if (enquiryProps.search) filter.search = enquiryProps.search;

    let enquiryRecords = await getEnquiry(filter);

    if(enquiryRecords.length ==0 ) return [];
    enquiryRecords = enquiryRecords.map(it => {
        return {
            id: it._id,
            name: it.name,
            phone: it.phone,
            email: it.email,
            message: it.message,
            created_on: moment(it.created_on).format("YYYY/MM/DD"),
            valid_upto: moment(it.valid_upto).format("YYYY/MM/DD")
        }
    })
    
    return enquiryRecords;
}

exports.countEnquiry = async(props) => {
    let filter = {}
    if (props) filter.data = props;
    return { count: enquiryCount };
}


exports.searchEnquiry = async(props) => {

    let enquiryRecords = await searchEnquiryWeb(props);
        enquiryRecords = sortByCondition.sort(enquiryRecords);

    return enquiryRecords
}

exports.deleteEnquiry = async(Id) => {
    if (!Id) throw new Error("Please provide Enquiry Id");

    let Response = await deleteEnquiry(Id);
    return Response;
}