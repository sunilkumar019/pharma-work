//import model
const model = require("../../models/employee");
const mongoose = require("mongoose");

//save a offer
module.exports = async (employee) => {
  employee._id = new mongoose.Types.ObjectId();
    
  return (await new model(employee).save()).toObject();  
}

