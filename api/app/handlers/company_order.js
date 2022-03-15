const orderController = require("../../../core/controllers/company_order")

const addOrder =async (req, res, next)=>{
    
    req.body.rep_id = req.repId;
    req.body.franchisee_id =req.franchiseeId;
    if(!req.is_owner){
        req.status = 403;
        return next(new Error("Not Authorized!!!"))
    }
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
  
    req.body.franchisee_id =req.franchiseeId;
   // req.body.rep_id = req.repId
    if(!req.is_owner){
        req.status = 403;
        return next(new Error("Not Authorized!!!"))
    }
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

const countOrder = async(req,res,next)=>{
   
    req.body.franchisee_id =req.franchiseeId;
    if(!req.is_owner){
        req.status = 403;
        return next(new Error("Not Authorized!!!"))
    }   
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


module.exports = {addOrder, getOrder, countOrder}