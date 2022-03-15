//import model
const model = require("../../models/stateCity");

//get states 
module.exports = async () => {
  return await model.find().select("name").sort({"name":1}).exec()
}