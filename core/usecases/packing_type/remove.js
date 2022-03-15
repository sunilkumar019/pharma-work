//import model
const model = require("../../models/packing_type");

module.exports = async (packingTypeId) => {
    let updateResponse = await model.deleteOne({ _id: packingTypeId }).exec()  
    if(updateResponse.ok == 1){
    return {Message:"Packing Type deleted!!!"}
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}