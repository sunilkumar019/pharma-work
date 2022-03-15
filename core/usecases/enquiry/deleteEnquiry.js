//import model
const model = require("../../models/enquiry");

module.exports = async (id) => {
    let deleteResponse = await model.remove({ _id: id }).exec() 
    if(deleteResponse.ok == 1){
    return {Message:"Enquiry deleted!!!"}
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}