//import model
const model = require("../../models/product");
const mongoose = require("mongoose");
//save a Product 
module.exports = async (product) => {
  product._id = new mongoose.Types.ObjectId();
   
  return (await new model(product).save()).toObject();  
}