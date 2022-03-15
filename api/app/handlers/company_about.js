const aboutController = require("../../../core/controllers/company_about")

const get = async(req,res,next)=>{
    try {
        let rs = await aboutController.get()
        req.data = rs
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}



module.exports = { get}