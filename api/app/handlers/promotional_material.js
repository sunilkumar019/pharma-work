const promoController = require("../../../core/controllers/promotionalMaterial")

const get = async(req,res,next)=>{
    try {
        let data = await promoController.get(req.body)
        req.data = data
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

module.exports = { get}