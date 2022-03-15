const stateCityController = require("../../../core/controllers/stateCity")


const getStates = async(req,res,next)=>{
    try {
        let states = await stateCityController.getStates()
        req.data = states
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const getCities = async(req,res,next)=>{
    try {
        let cities = await stateCityController.getCities(req.params.stateId)
        req.data = cities
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

/*

const addDivision =async (req, res, next)=>{
    
    try {
        let division = await stateCityController.addDivision(req.body)
        req.data = division
        next()
    }
    catch (e) {
        req.status = 409;
        next(e)
    }
}

const updateDivision = async(req,res,next)=>{
    try {
        let divisionRecords = await stateCityController.updateDivision(req.body)
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
        let divisionRes = await stateCityController.deleteDivision(req.params.Id)
        if(divisionRes.Error){
            req.status = 400;
            next(divisionRes.Error)
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

*/


module.exports = {getStates, getCities}