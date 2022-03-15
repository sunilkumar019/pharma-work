//import model
const model = require("../../models/franchisee");
const mongoose = require("mongoose");
const getFranchisees = require("./getFranchisee");
//save a franchisee
module.exports = async (franchisee) => {
  franchisee._id = new mongoose.Types.ObjectId();
  // let franchiseeRecords = await getFranchisees({email:franchisee.email});
  // if(franchiseeRecords.length>0){
  //    throw new Error("franchisee already Exists!!!");
  // }
    
  return (await new model(franchisee).save()).toObject();  
}