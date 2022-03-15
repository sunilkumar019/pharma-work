//import model
const model = require("../../models/rep");

//delete a rep  (setting rep status to false)
module.exports = async (repId) => {
    let updateResponse = await model.deleteOne({ _id: repId }).exec() 
    if(updateResponse.ok == 1){
    return {Message:"Rep deleted!!!"}
   }
   else{
       return {Error: "Something went wrong!!!"}
   }

}