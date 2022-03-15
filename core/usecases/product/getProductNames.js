//import model
const model = require("../../models/product");

//get product  
module.exports = async (filters) => {
  return  await model.find(filters).select("name").exec();


}