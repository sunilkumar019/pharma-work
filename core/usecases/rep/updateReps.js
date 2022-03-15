//import model
const model = require("../../models/rep");
const getRep = require("./getRep");
//update a rep 
module.exports = async (repId,data) => {
    let updateResponse = await model.updateOne({ _id: repId }, { $set: data }).exec() 
   if(updateResponse.ok == 1){
    return await getRep({_id:repId});
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}