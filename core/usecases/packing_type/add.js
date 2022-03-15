//import model
const model = require("../../models/packing_type");
const get = require("./get");
const mongoose = require("mongoose");

module.exports = async (type) => {
  type._id = new mongoose.Types.ObjectId();
  let oldTypes =  await get({name: type.name});
  if(oldTypes.length>0) throw new Error("Packing Type Already Exists");
  return (await new model(type).save()).toObject();  
}