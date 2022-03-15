//import model
const model = require("../../models/certificates");
//update a certificate info 
module.exports = async (certificateId,data) => {
    let updateResponse = await model.updateOne({ _id: certificateId }, { $set: data }).exec() 
   if(updateResponse.ok == 1){
    return {Message:"Information Updated"}    
    }
   else{
       return {Error: "Something went wrong!!!"}
   }
}