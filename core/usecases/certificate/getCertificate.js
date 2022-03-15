//import model
const model = require("../../models/certificates");
 
module.exports = async (filters) => {

  return await model.find(filters).sort({created_on:-1}).exec()
}