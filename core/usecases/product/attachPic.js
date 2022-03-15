//import model
const model = require("../../models/product");
//const getProduct = require("./getProduct");
//update a product 
module.exports = async (productId,data) => {
    let updateResponse = await model.findByIdAndUpdate({ _id: productId }, {$push: {images: {url: data.url, type: data.type}}},).exec() 
    if(updateResponse){
    return {message:"Successfull!!"}
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}