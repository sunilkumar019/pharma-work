const certificateController = require("../../../core/controllers/certificate")

const addCertificate =async (req, res, next)=>{

    try {
        let response = await certificateController.addCertificate(req.file,req.body)
        req.data = response
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const getCertificate = async(req,res,next)=>{
    try {
        let data = await certificateController.getCertificate(req.body);
        req.data = data
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const countCertificates = async(req,res,next)=>{
    try {
        let count = await certificateController.countCertificates();
        req.data = count
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const updateCertificate = async(req,res,next)=>{

    try {
        let data = await certificateController.updateCertificate(req.file,req.body)
        req.data = data
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const deleteCertificate = async(req,res,next)=>{

    try {
        let response = await certificateController.deleteCertificate(req.params.Id)
        if(response.Error){
            req.status = 400;
            next(response.Error)
        }
        else{
            req.message = response.Message;
            req.data = null;
            next()
        }
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}


module.exports = { addCertificate, getCertificate, countCertificates, updateCertificate, deleteCertificate}