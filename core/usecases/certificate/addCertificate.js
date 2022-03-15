//import model
const model = require("../../models/certificates");
const mongoose = require("mongoose");

module.exports = async (certificate) => {
  certificate._id = new mongoose.Types.ObjectId();
    
  return (await new model(certificate).save()).toObject();  
}

