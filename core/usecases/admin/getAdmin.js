//import model
const model = require("../../models/admin");

//get rep 
module.exports = async (filters) => {
  return await model.findOne(filters).exec()
}