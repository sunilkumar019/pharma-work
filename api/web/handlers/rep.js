const repController = require("../../../core/controllers/rep")

const addRep = async(req, res, next) => {

    req.body.active = true;
    if (req.body.profile_pic) req.body.profile_pic = req.file.path;
    try {
        let rep = await repController.addRep(req.body)
        req.data = rep
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const getRep = async(req, res, next) => {

    try {
        //req.body.is_owner = true;
        let rep = await repController.getRep(req.body)
        req.data = rep
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const getSingleRep = async(req, res, next) => {

    try {
        let rep = await repController.getSingleRep({ id: req.params.Id })
        req.data = rep
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const updateRep = async(req, res, next) => {
    if (req.file) req.body.profile_pic = req.file.path;
    try {
        let repRecords = await repController.updateRep(req.body)
        req.data = repRecords
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const activateRep = async(req, res, next) => {
    try {
        let repRecords = await repController.activateRep(req.params.Id)
        req.data = repRecords
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const deactivateRep = async(req, res, next) => {

    try {
        let repRes = await repController.deactivateRep(req.params.Id)
        if (repRes.Error) {
            req.status = 400;
            next(repRes.Error)
        } else {
            req.message = repRes.Message;
            req.data = null;
            next()
        }
    } catch (e) {
        console.log(e)
        req.status = 400;
        next(e)
    }
}

const deleteRep = async(req, res, next) => {

    try {
        let repRes = await repController.deleteRep(req.params.Id)
        if (repRes.Error) {
            req.status = 400;
            next(repRes.Error)
        } else {
            req.message = repRes.Message;
            req.data = null;
            next()
        }
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const getRepCount = async(req, res, next) => {
    try {
        let rep = await repController.getRepCount(req.body)
        req.data = rep
        next()
    } catch (e) {
        console.log(e)
        req.status = 400;
        next(e)
    }
}

const distributorsCount = async(req, res, next) => {
    try {
        let rep = await repController.distributorsCount()
        req.data = rep
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const bulkUpload = async(req, res, next) => {
    try {
        // result = await convertcsvtojson('./uploads/ProductImages/' + req.file.filename);
        let repList = await repController.bulkUpload(req.file.filename)
        req.data = repList
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }

}



const getRepVisitAnalysis = async(req, res, next) => {

    try {
        let visit = await repController.getRepVisitAnalysis(req.body)
        req.data = visit
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}


const repSearch = async(req, res, next) => {

    try {
        let visit = await repController.repSearch(req.body)
        req.data = visit
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}


module.exports = {
    addRep,
    getRep,
    getSingleRep,
    updateRep,
    activateRep,
    deactivateRep,
    deleteRep,
    getRepCount,
    distributorsCount,
    bulkUpload,
    getRepVisitAnalysis,
    repSearch
}