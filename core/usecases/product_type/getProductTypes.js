//import model
const model = require("../../models/product_types");

//get product types 
module.exports = async (filters) => {
  return await model.find(filters).exec()
}