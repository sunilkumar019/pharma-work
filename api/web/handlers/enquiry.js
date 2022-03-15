const enquiryController = require("../../../core/controllers/enquiry")

const getEnquiry =async (req, res, next)=>{

    try {
        let res = await enquiryController.getEnquiry(req.body)
        
        req.data = res;
    
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const deleteEnquiry =async (req, res, next)=>{

    try {
        let res = await enquiryController.deleteEnquiry(req.params.Id)
        
        if(res.Error){
            req.status = 400;
            throw new Error(res.Error)
        }
        else{
            req.message = res.Message;
            req.data = null;
            next()
        }
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const countEnquiry =async (req, res, next)=>{

    try {
        let res = await enquiryController.countEnquiry(req.body)
        
        req.data = res;
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const searchEnquiry =async (req, res, next)=>{

    try {
        let res = await enquiryController.searchEnquiry(req.body)
        
        req.data = res;
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}


module.exports = {getEnquiry, deleteEnquiry, countEnquiry , searchEnquiry}