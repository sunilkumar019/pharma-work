//import model
const model = require("../../models/rep");

//get rep  count
module.exports = async(filters) => {

    return await model.countDocuments(filters)
}