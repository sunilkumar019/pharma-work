const customerController = require("../../../core/controllers/customer")

const getCustomer = async(req, res, next) => {

    try {
        let customers = await customerController.getCustomer(req.body)
        req.data = customers
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const countCustomer = async(req, res, next) => {

    try {
        let customers = await customerController.countCustomer()
        req.data = {count: customers}
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const searchCustomer = async(req, res, next) => {
    
    try {
        let customers = await customerController.searchCustomer(req.body)
        req.data = customers
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}




module.exports = { getCustomer, countCustomer, searchCustomer }