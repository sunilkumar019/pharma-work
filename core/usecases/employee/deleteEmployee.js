//import model
const model = require("../../models/employee");

module.exports = async (employeeId) => {
    
    let updateResponse = await model.deleteOne({ _id: employeeId }).exec()  
    if(updateResponse.ok == 1){
    return {Message:"Employee deleted!!!"}
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}