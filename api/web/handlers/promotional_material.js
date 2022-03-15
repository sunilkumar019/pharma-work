const promoController = require("../../../core/controllers/promotionalMaterial")

const add =async (req, res, next)=>{

    try {
        if(req.file) req.body.image = req.file.path;
        else req.body.image = undefined
        let data = await promoController.add(req.body)
        req.data = data
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

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


const update = async(req,res,next)=>{

    try {
        if(req.file) req.body.image = req.file.path;
        else req.body.image = undefined
        let data = await promoController.update(req.body)
        req.data = data
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const remove = async(req,res,next)=>{

    try {
        let data = await promoController.remove(req.params.Id)
        if(data.Error){
            req.status = 400;
            next(data.Error)
        }
        else{
            req.message = data.Message;
            req.data = null;
            next()
        }
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}


module.exports = { add, get, update, remove}