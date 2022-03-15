const repController = require("../../../core/controllers/rep")
const jwt = require("jsonwebtoken")

const addRep = async(req, res, next) => {
    if (!req.is_owner) {
        req.status = 403;
        return next(new Error("Not Authorized!!!"))
    }
    req.body.franchisee_id = req.franchiseeId;
    req.body.active = true;
    try {
        let rep = await repController.addRep(req.body)
        req.data = rep
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

//for all reps
const getRep = async(req, res, next) => {
    if (!req.is_owner) {
        req.status = 403;
        return next(new Error("Not Authorized!!!"))
    }
    req.body.franchisee_id = req.franchiseeId
    try {
        let rep = await repController.getRep(req.body)
        req.data = rep
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

//search rep and send otp to email
const searchRep = async(req, res, next) => {

    if(!req.body.email) return next(new Error("Email is Required!!!"))
    try {
        let rep = await repController.searchAccountOfRep({email: req.body.email})
        req.data = rep;
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const verifyOtp = async (req, res, next) => {

    try {

        if(!req.body.id) return next(new Error("Rep Id is Required!!!"))
        if(!req.body.otp) return next(new Error("OTP is Required!!!"))
        let rep = await repController.verifyOtp(req.body.id, req.body.otp);
        if(rep){
            req.message = "OTP verified"
            req.data = {id: req.body.id};
            next()
        }
        else{
            return next(new Error("Invalid OTP"));
        }
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

//rep passwprd reset after otp verified
const resetRepPassword = async (req, res, next) => {

    try {

        if(!req.body.id) return next(new Error("Rep Id is Required!!!"))
        if(!req.body.password) return next(new Error("password is Required!!!"))
        let rep = await repController.resetPassword({id: req.body.id, password: req.body.password, fromOtp: true});
        if(rep == false){
            return next(new Error("Session timeout"));
        }
        req.data = rep
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
};


const repLogin = async(req, res, next) => {

    if (!req.body.emailOrPhone) return next(new Error("Please Provide email or phone"))
    if (!req.body.password) return next(new Error("Please Provide Password"))

    let filter = {emailOrPhone: req.body.emailOrPhone, password: req.body.password}
    if (req.body.device_token)
        filter.device_token = req.body.device_token;
    try {
        let rep = await repController.repLogin(filter)
        if (rep.Error) {
            req.data = null;
            req.status = 403;
            return next(new Error(rep.Error));
        }
        req.data = rep
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const getRepProfile = async(req, res, next) => {
    try {
        let filter = { id: req.repId }
        let rep = await repController.getSingleRep(filter)
        req.data = rep
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const updateRep = async(req, res, next) => {
    req.body.id = req.repId;
    try {
        let repRecords = await repController.updateRep(req.body)
        req.data = repRecords
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const changePassword = async(req, res, next) => {
    req.body.id = req.repId;
    try {
        let repRecords = await repController.changePassword(req.body)
        req.data = repRecords
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const resetPassword = async(req, res, next) => {
    if (!req.is_owner) {
        req.status = 403;
        return next(new Error("Not Authorized!!!"))
    }
    try {
        let repRecords = await repController.resetPassword(req.body)
        req.data = repRecords
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const activateRep = async(req, res, next) => {
    if (!req.is_owner) {
        req.status = 403;
        return next(new Error("Not Authorized!!!"))
    }
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
    if (!req.is_owner) {
        req.status = 403;
        return next(new Error("Not Authorized!!!"))
    }
    try {
        let repRecords = await repController.deactivateRep(req.params.Id)
        req.data = repRecords
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const getRepCount = async(req, res, next) => {
    if (!req.is_owner) {
        req.status = 403;
        return next(new Error("Not Authorized!!!"))
    }
    let filter = {};
    filter.franchisee_id = req.franchiseeId
    try {
        let rep = await repController.getRepCount(filter)
        req.data = rep
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const deleteRep = async(req, res, next) => {
    if (!req.is_owner) {
        req.status = 403;
        return next(new Error("Not Authorized!!!"))
    }
    try {
        let repRes = await repController.deactivateRep(req.params.Id)
        req.data = repRes
        next()
            // if (repRes.Error) {
            //     req.status = 400;
            //     next(repRes.Error)
            // } else {
            //     req.message = repRes.Message;
            //     req.data = null;
            //     next()
            // }
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const getReport = async(req, res, next) => {
    if (!req.is_owner) {
        req.status = 403;
        return next(new Error("Not Authorized!!!"))
    }
    req.body.franchisee_id = req.franchiseeId
    try {
        let report = await repController.getReport(req.body)
        req.data = report
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

/********************Rep visit handler*************************** */

const addRepVisit = async(req, res, next) => {
    req.body.franchisee_id = req.franchiseeId;
    req.body.rep_id = req.repId;
    try {
        let visit = await repController.addRepVisit(req.body)
        req.data = visit
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const getRepVisit = async(req, res, next) => {
    req.body.franchisee_id = req.franchiseeId;
    if (!req.is_owner) {
        req.body.rep_id = req.repId;
    }
    try {
        let visit = await repController.getRepVisit(req.body)
        req.data = visit
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const getRepVisitAnalysis = async(req, res, next) => {

    req.body.franchisee_id = req.franchiseeId;
    if (req.is_owner == false) req.body.rep_id = req.repId
    try {
        let visit = await repController.getRepVisitAnalysis(req.body)
        req.data = visit
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const logout = async(req, res, next) => {

    try {
        let rs = await repController.logout(req.repId)
        req.message = "Logged out successfully";
        req.data = null;
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const deleteMr = async (req, res, next) => {
    let filter = { id: req.params.id };

    if(!filter.id)
        throw new Error("Please provide MR id !!")

    try {
        let rs = await repController.deleteMr(filter)
        req.message = "Mr Deleted !!";
        req.data = null;
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const updateMr = async (req, res, next) => {
    try {
        let repRecords = await repController.updateRep(req.body)
        req.data = repRecords
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

module.exports = {
    addRep,
    getRep,
    searchRep,
    verifyOtp,
    resetRepPassword,
    repLogin,
    getRepProfile,
    updateRep,
    changePassword,
    resetPassword,
    activateRep,
    deactivateRep,
    getRepCount,
    deleteRep,
    deleteMr,
    updateMr,
    getReport,
    addRepVisit,
    getRepVisit,
    getRepVisitAnalysis,
    logout
}
