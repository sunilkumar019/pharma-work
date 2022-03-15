//import model
const model = require("../../models/certificates");

module.exports = async () => {

   return await model.countDocuments({})
}