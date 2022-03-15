//import model
const model = require("../../models/division");
const mongoose = require("mongoose");
//delete a division  (setting division status to false)
module.exports = async (divisionId) => {
    
    let updateResponse = await model.deleteOne({ _id: divisionId }).exec()  
    if(updateResponse.ok == 1){
    return {Message:"division deleted!!!"}
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}