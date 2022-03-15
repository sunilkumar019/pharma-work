const adminController = require("../../../core/controllers/admin")
const mongoose = require("mongoose");

const addAdmin = async(req, res, next) => {

    try {
        if(!req.body.token){
            req.status = 403;
            return next(new Error("No Token Provided For Adding Admin."));
        }else if(req.body.token != process.env.ADMIN_ADD_TOKEN){
            req.status = 403;
            return next(new Error("Invalid Token Provided For Adding Admin."));
        }
        let rep = await adminController.addAdmin(req.file, req.body)
        req.data = rep
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const adminLogin = async(req, res, next) => {
    if (!req.body.email) return next(new Error("Please Provide email"))
    if (!req.body.password) return next(new Error("Please Provide Password"))

    let filter = { email: req.body.email, password: req.body.password };
    try {
        let rep = await adminController.adminLogin(filter)
        if (rep.Error) {
            req.data = null;
            req.status = 403;
            return next(new Error(rep.Error));
        }
        req.data = rep;
        req.message = "Login Successfull!!"
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const updateAdmin = async(req, res, next) => {
    try {
        req.body.id = req.adminData.Id;
        let repRecords = await adminController.updateAdmin(req.file, req.body)
        req.data = repRecords
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const adminProfile = async(req, res, next) => {
    try {
        let admin = await adminController.adminProfile(req.adminData)
        req.data = admin
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const changeAdminPassword = async(req, res, next) => {
    req.body.id = req.adminData.Id;
    try {
        let adminRecords = await adminController.changePassword(req.body)
        req.data = adminRecords
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const resetAdminPassword = async(req, res, next) => {

    try {
        let adminRecords = null;
        if(req.body && req.body.adminId && req.body.password) {
            adminRecords = await resetAdminPasswordWithUserId(req);
        } else {
            adminRecords = await adminController.resetPassword(req.body.email)
        }
        req.data = adminRecords;
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const resetAdminPasswordWithUserId = async (req) => {
    const { adminId, password } = req.body;
    let isValid = mongoose.Types.ObjectId.isValid(adminId); //true
    if(!isValid)
        return {
            status: 400,
            message: "Admin Id is not valid"
        }
    if(!password)
        return {
            status: 400,
            message: "Invalid password"
        }
    return await adminController.resetPasswordWithUserId({adminId, password})
}

module.exports = {
    addAdmin,
    updateAdmin,
    adminLogin,
    adminProfile,
    changeAdminPassword,
    resetAdminPassword
}