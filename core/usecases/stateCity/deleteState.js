//import model
const model = require("../../models/stateCity");
const mongoose = require("mongoose");
//delete a state 
module.exports = async (stateId) => {
    let updateResponse = await model.deleteOne({ _id: stateId }).exec()  
    if(updateResponse.ok == 1){
    return {Message:"state deleted!!!"}
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}