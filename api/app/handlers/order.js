const orderController = require("../../../core/controllers/order")
const addOrder = async (req, res, next) => {
    req.body.rep_id = req.repId;
    req.body.franchisee_id = req.franchiseeId;
    try {
        let Order = await orderController.addOrder(req.body)
        req.data = Order
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const getOrder = async (req, res, next) => {
    req.body.franchisee_id = req.franchiseeId;
    if (!req.is_owner)
        req.body.rep_id = req.repId;

    try {
        let order = await orderController.getOrder(req.body)
        req.data = order
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const countOrder = async (req, res, next) => {
    req.body.franchisee_id = req.franchiseeId;
    if (!req.is_owner)
        req.body.rep_id = req.repId;

    try {
        let orderCount = await orderController.countOrder(req.body);
        req.data = orderCount
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

//not used
const updateOrder = async (req, res, next) => {
    req.body.repIsOwner = req.is_owner;
    try {
        let divisionRecords = await orderController.updateOrder(req.body)
        req.data = divisionRecords
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

//not used
const deleteOrder = async (req, res, next) => {
    try {
        let divisionRes = await orderController.deleteOrder(req.params.Id)
        if (divisionRes.Error) {
            req.status = 400;
            next(divisionRes.Error)
        }
        else {
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


module.exports = { addOrder, getOrder, countOrder, updateOrder, deleteOrder }