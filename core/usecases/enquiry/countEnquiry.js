//import model
const model = require("../../models/enquiry");

module.exports = async (filters) => {

   return await model.countDocuments(filters)
}