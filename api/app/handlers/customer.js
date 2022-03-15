const customerController = require("../../../core/controllers/customer")
const addCustomer = async(req, res, next) => {
    if (!req.repId) {
        req.status = 403;
        return next(new Error("Not Authorized!!!"))
    }
    req.body.franchisee_id = req.franchiseeId;
    req.body.rep_id = req.repId;
    try {
        let Customer = await customerController.addCustomer(req.body);
        req.data = Customer;
        next();
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const bulkUpload = async(req, res, next) => {
    try {
        // result = await convertcsvtojson('./uploads/ProductImages/' + req.file.filename);
        let customerList = await customerController.bulkUpload(req.file.filename)
        req.data = customerList
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }

}

const getCustomer = async(req, res, next) => {
    if (!req.repId) {
        req.status = 403;
        return next(new Error("Not Authorized!!!"))
    }
    if (!req.is_owner)
        req.body.rep_id = req.repId;

    req.body.franchisee_id = req.franchiseeId;

    try {
        let customers = await customerController.getCustomer(req.body)
        req.data = customers
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const updateCustomer = async(req, res, next) => {
    if (!req.repId) {
        req.status = 403;
        return next(new Error("Not Authorized!!!"))
    }
    if (!req.is_owner)
        req.body.franchisee_id = req.franchiseeId
    req.body.rep_id = req.repId

    try {
        let customerRecords = await customerController.updateCustomer(req.body)
        req.data = customerRecords
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const deleteCustomer = async(req, res, next) => {
    if (!req.repId) {
        req.status = 403;
        return next(new Error("Not Authorized!!!"))
    }
    try {
        let customerRes = await customerController.deleteCustomer(req.params.Id)
        if (customerRes.Error) {
            req.status = 400;
            next(customerRes.Error)
        } else {
            req.message = customerRes.Message;
            req.data = null;
            next()
        }
    } catch (e) {
        req.status = 400;
        next(e)
    }
}


module.exports = { addCustomer, bulkUpload, getCustomer, updateCustomer, deleteCustomer }