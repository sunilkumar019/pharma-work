//import model
const model = require("../../models/enquiry");
const mongoose = require("mongoose");

module.exports = async (enquiry) => {
  enquiry._id = new mongoose.Types.ObjectId();
    
  return (await new model(enquiry).save()).toObject();  
}

