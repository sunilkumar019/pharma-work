//import model
const model = require("../../models/order");

//delete a order
module.exports = async (orderId) => {
    let deleteResponse = await model.remove({ _id: orderId }).exec() 
    if(deleteResponse.ok == 1){
    return {Message:"Order deleted!!!"}
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}

//needs to be checked