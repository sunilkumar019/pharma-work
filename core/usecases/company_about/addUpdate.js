//import model
const model = require("../../models/comapny_about");
const mongoose = require("mongoose");
const get = require("./get");

module.exports = async (about) => {
 
  if(!about._id){
    about._id = new mongoose.Types.ObjectId();
    let rs = (await new model(about).save()).toObject();  
  }
  else{
    let id = about._id;
    delete about._id;
    about.modified_on = new Date(Date.now());
    let updateResponse = await model.updateOne({ _id: id }, { $set: about }).exec() 
  }

  return await get()
  
}