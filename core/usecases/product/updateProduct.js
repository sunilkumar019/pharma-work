//import model
const model = require("../../models/product");
const getProduct = require("./getProduct");
//update a product 
module.exports = async (productId,data) => {
    let updateResponse = await model.updateOne({ _id: productId }, { $set: data }).exec() 
   if(updateResponse.ok == 1){
    return await getProduct({_id:productId});
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}