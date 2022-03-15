//import model
const model = require("../../models/customer");
const getCustomer = require("./getCustomers");
//update a customer 
module.exports = async (customerId,data) => {
    let updateResponse = await model.updateOne({ _id: customerId }, { $set: data }).exec() 
   if(updateResponse.ok == 1){
    return await getCustomer({_id:customerId});
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}