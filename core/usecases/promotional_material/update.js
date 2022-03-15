//import model
const model = require("../../models/promotionalMaterial");

module.exports = async (Id,data) => {
    let updateResponse = await model.updateOne({ _id: Id }, { $set: data }).exec() 
   if(updateResponse.ok == 1){
    return {Message:"Entry Updated"}    
    }
   else{
       return {Error: "Something went wrong!!!"}
   }
}