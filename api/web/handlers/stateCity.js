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

const addState =async (req, res, next)=>{
    try {
        let state = await stateCityController.addState(req.body)
        req.data = state
        next()
    }
    catch (e) {
        req.status = 409;
        next(e)
    }
}

const updateState = async(req,res,next)=>{
    try {
        let stateRecords = await stateCityController.updateState(req.body)
        req.data = stateRecords
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const deleteState = async(req,res,next)=>{
    try {
        let stateRes = await stateCityController.deleteState(req.params.Id)
        if(stateRes.Error){
            req.status = 400;
            next(stateRes.Error)
        }
        else{
            req.message = stateRes.Message;
            req.data = null;
            next()
        }
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const addCity = async(req,res,next)=>{
    try {
        let cityRes = await stateCityController.addCity(req.body)
        req.data = cityRes
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const updateCity = async(req,res,next)=>{
    try {
        let cityRes = await stateCityController.updateCity(req.body)
        req.data = cityRes
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const deleteCity = async(req,res,next)=>{
    try {
        let cityRes = await stateCityController.deleteCity(req.body)
        req.data = cityRes
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}



module.exports = {
    getStates, addState, getCities, updateState, deleteState,
    addCity, updateCity, deleteCity
}