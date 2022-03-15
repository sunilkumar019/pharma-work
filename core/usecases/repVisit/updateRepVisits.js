//import model
const model = require("../../models/repVisit");
const getRepVisits = require("./getRepVisits");
//update a rep Visit
module.exports = async (repVisitId,data) => {
    let updateResponse = await model.updateOne({ _id: repVisitId }, { $set: data }).exec() 
   if(updateResponse.ok == 1){
    return await getRepVisits({_id:repVisitId});
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}