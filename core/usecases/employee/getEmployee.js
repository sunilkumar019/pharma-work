const model = require("../../models/employee");

//get cities 
module.exports = async () => {
  return await model.find().select("name").sort({"name":1}).exec()

}