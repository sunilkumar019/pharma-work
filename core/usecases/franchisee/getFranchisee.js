//import model
const model = require("../../models/franchisee");

//get franchisee 
module.exports = async (filters) => {
  return await model.find(filters).populate("divisions").sort({active:-1}).exec()
}