//import model
const model = require("../../models/company_order");

module.exports = async (orderId) => {
    
    let updateResponse = await model.deleteOne({ _id: orderId }).exec()  
    if(updateResponse.ok == 1){
    return {Message:"Order deleted!!!"}
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}