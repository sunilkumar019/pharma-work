//import model
const model = require("../../models/product_category");
const mongoose = require("mongoose");
//save a Product Category
module.exports = async (category) => {
  category._id = new mongoose.Types.ObjectId();
   
  return (await new model(category).save()).toObject();  
}