//import model
const model = require("../../models/product_category");
const getProductCategorys = require("./getProductCategorys");
//update a product category 
module.exports = async (categoryId,data) => {
    let updateResponse = await model.updateOne({ _id: categoryId }, { $set: data }).exec() 
   if(updateResponse.ok == 1){
    return await getProductCategorys({_id:categoryId});
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}