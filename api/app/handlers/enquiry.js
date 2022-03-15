const enquiryController = require("../../../core/controllers/enquiry")

const addEnquiry =async (req, res, next)=>{
    

    try {

        if(!req.body.name){
            req.status = 400;
            return next(new Error("Name is Required"));
        }
        if(!req.body.phone){
            req.status = 400;
            return next(new Error("Phone is Required"));
        }

        let res = await enquiryController.addEnquiry(req.body)
        req.message = "Enquiry Placed Successfully";
        req.data = null;
        next()
    }
    catch (e) {
        req.status = 400; 
        next(e)
    }
}

module.exports = {addEnquiry}