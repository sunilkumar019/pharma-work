//import model
const model = require("../../models/rep");

//delete a rep  (setting rep status to false)
module.exports = async (repId) => {
    let updateResponse = await model.updateOne({ _id: repId }, { $set: {active:false} }).exec() 
    if(updateResponse.ok == 1){
    return {Message:"rep deleted!!!"}
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}