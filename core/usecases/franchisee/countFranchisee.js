//import model
const model = require("../../models/franchisee");

//count franchisee 
module.exports = async () => {
  return await model.countDocuments().exec()
}