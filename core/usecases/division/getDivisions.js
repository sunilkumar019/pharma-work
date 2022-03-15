//import model
const model = require("../../models/division");

//get division 
module.exports = async (filters) => {
  return await model.find(filters).exec()
}