//import model
const model = require("../../models/packing_type");

module.exports = async (filters) => {
  return await model.find(filters).exec()
}