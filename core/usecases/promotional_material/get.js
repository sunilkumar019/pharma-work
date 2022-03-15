//import model
const model = require("../../models/promotionalMaterial");

module.exports = async (filters) => {
  return await model.find(filters).exec()
}