//import model
const model = require("../../models/division");
const getDivisions = require("./getDivisions");
//update a customer 
module.exports = async (divisionId,data) => {
    let updateResponse = await model.updateOne({ _id: divisionId }, { $set: data }).exec() 
   if(updateResponse.ok == 1){
    return await getDivisions({_id:divisionId});
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}