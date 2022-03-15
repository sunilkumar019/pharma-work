//import model
const model = require("../../models/product_types");
const getProductTypes = require("./getProductTypes");
//update a product category 
module.exports = async (typeId,data) => {
    let updateResponse = await model.updateOne({ _id: typeId }, { $set: data }).exec() 
   if(updateResponse.ok == 1){
    return await getProductTypes({_id:typeId});
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}