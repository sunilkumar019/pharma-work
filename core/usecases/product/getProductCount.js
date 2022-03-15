//import model
const model = require("../../models/product");

//get rep  count
module.exports = async (filters) => {
  filters.active = true;
   return await model.countDocuments(filters)
}