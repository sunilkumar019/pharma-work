//import model
const model = require("../../models/product_types");
const mongoose = require("mongoose");
//save a Product type
module.exports = async (type) => {
  type._id = new mongoose.Types.ObjectId();
   
  return (await new model(type).save()).toObject();  
}