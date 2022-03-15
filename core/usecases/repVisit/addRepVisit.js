//import model
const model = require("../../models/repVisit")
const mongoose = require("mongoose");
const getRepVisits = require("./getRepVisits");
//save a Rep Visit
module.exports = async (repVisit) => {
  repVisit._id = new mongoose.Types.ObjectId();
  return (await new model(repVisit).save()).toObject();  
}