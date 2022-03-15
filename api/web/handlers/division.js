const divisionController = require("../../../core/controllers/division")
const addDivision =async (req, res, next)=>{
    
    try {
        let division = await divisionController.addDivision(req.body)
        req.data = division
        next()
    }
    catch (e) {
        req.status = 409;
        next(e)
    }
}

const getDivision = async(req,res,next)=>{
    try {
        let divisions = await divisionController.getDivision(req.body)
        req.data = divisions
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const updateDivision = async(req,res,next)=>{
    try {
        let divisionRecords = await divisionController.updateDivision(req.body)
        req.data = divisionRecords
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const deleteDivision = async(req,res,next)=>{
    try {
        let divisionRes = await divisionController.deleteDivision(req.params.Id)
        if(divisionRes.Error){
            req.status = 400;
            throw new Error(divisionRes.Error)
        }
        else{
            req.message = divisionRes.Message;
            req.data = null;
            next()
        }
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}


module.exports = {addDivision, getDivision, updateDivision, deleteDivision}