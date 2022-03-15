//import model
const model = require("../../models/order");
const getOrders = require("./getOrders");
//update a order 
module.exports = async (orderId,data) => {
    let updateResponse = await model.updateOne({ _id: orderId }, { $set: data }).exec() 
   if(updateResponse.ok == 1){
    return await getOrders({_id:orderId});
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}