//import model
const model = require("../../models/product_category");

//delete a Product category  (setting category status to false)
module.exports = async (categoryId) => {
    let updateResponse = await model.deleteOne({ _id: categoryId }).exec()  
    if(updateResponse.ok == 1){
    return {Message:"Product category deleted!!!"}
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}