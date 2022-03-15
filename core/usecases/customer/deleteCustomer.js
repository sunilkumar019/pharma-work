//import model
const model = require("../../models/customer");

//delete a customer  (setting customer status to false)
module.exports = async (customerId) => {
    let updateResponse = await model.updateOne({ _id: customerId }, { $set: {active:false} }).exec() 
    if(updateResponse.ok == 1){
    return {Message:"Customer deleted!!!"}
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}