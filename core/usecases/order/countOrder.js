//import model
const model = require("../../models/order");

//get order  count
module.exports = async (filters) => {

   return await model.countDocuments(filters)
}