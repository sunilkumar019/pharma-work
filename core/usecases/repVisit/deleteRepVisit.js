//import model
const model = require("../../models/repvisitVisit");

//delete a repvisit  (setting repvisit status to false)
module.exports = async (repvisitId) => {
    let updateResponse = await model.remove({ _id: repvisitId }).exec() 
    if(updateResponse.ok == 1){
    return {Message:"repvisit deleted!!!"}
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}
//needs to be checked