//import model
const model = require("../../models/promotionalMaterial");
const mongoose = require("mongoose");

//save a data
module.exports = async (data) => {
  data._id = new mongoose.Types.ObjectId();
    
  return (await new model(data).save()).toObject();  
}