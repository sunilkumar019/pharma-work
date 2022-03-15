//import model
const model = require("../../models/company_order");

//get order  count
module.exports = async (filters) => {

   return await model.countDocuments(filters)
}