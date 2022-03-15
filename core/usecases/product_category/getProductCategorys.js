//import model
const model = require("../../models/product_category");

//get product category 
module.exports = async (filters) => {
  return await model.find(filters).exec()
}