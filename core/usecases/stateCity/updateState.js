//import model
const model = require("../../models/stateCity");
const getStates = require("./getStates");
//update a state 
module.exports = async (stateId,data) => {
    let updateResponse = await model.updateOne({ _id: stateId }, { $set: data }).exec() 
   if(updateResponse.ok == 1){
    return await getStates();
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}