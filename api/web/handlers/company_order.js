const orderController = require("../../../core/controllers/company_order")

//not used
const addOrder =async (req, res, next)=>{
    
    // req.body.rep_id = req.repId;
    // req.body.franchisee_id =req.franchiseeId;
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

const getOrder = async(req,res,next)=>{
  
    let filter = {}
    if(req.franchiseeId) filter.franchisee_id;

    try {
        let order = await orderController.getOrder(filter)
        req.data = order
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const countOrder = async(req,res,next)=>{
   let filter = {}
    if(req.franchiseeId) filter.franchisee_id;

    try {
        let orderCount = await orderController.countOrder(filter);
        req.data = orderCount
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}


const deleteOrder = async(req,res,next)=>{
    try {
        let orderRes = await orderController.deleteOrder(req.params.Id)
        if(orderRes.Error){
            req.status = 400;
            throw new Error(orderRes.Error)
        }
        else{
            req.message = orderRes.Message;
            req.data = null;
            next()
        }
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const searchOrder = async(req, res, next) => {
    try {
        let orderRes = await orderController.searchOrder(req.body)
        req.data = orderRes
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const deleteOrders = async (req, res, next) => {
    try {
        let orderRes = await orderController.deleteOrders(req.params.action, req.body)
        if(orderRes.Error){
            req.status = 400;
            throw new Error(orderRes.Error)
        }
        else{
            req.message = orderRes.Message;
            req.data = null;
            next()
        }
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}


module.exports = {addOrder, getOrder, countOrder, deleteOrder, searchOrder, deleteOrders}