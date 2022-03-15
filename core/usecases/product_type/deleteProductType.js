//import model
const model = require("../../models/product_types");

//delete a Product type 
module.exports = async (typeId) => {
    let updateResponse = await model.deleteOne({ _id: typeId }).exec() 
    if(updateResponse.ok == 1){
    return {Message:"Product type deleted!!!"}
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}