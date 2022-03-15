//import model
const model = require("../../models/division");
const mongoose = require("mongoose");
const getDivisions = require("./getDivisions");
//save a division
module.exports = async (division) => {
  division._id = new mongoose.Types.ObjectId();
  let divisionRecords = await getDivisions({name:division.name});
  if(divisionRecords.length>0){
     throw new Error("division already Exists!!!");
  }
    
  return (await new model(division).save()).toObject();  
}