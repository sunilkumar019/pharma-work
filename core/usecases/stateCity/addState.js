//import model
const model = require("../../models/stateCity");
const mongoose = require("mongoose");
const getStates = require("./getStates");
//save a state
module.exports = async (state) => {
  state._id = new mongoose.Types.ObjectId();
  
  if(await stateExists(state.name)){
     throw new Error("state already Exists!!!");
  }
    
  return (await new model(state).save()).toObject();  
}

stateExists = async (name) => {
  let stateRecords = await getStates();
  return stateRecords.some(function(el) {
    return el.name === name;
  }); 
}