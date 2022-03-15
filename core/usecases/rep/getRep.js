//import model
const model = require("../../models/rep");

//get rep 
module.exports = async(filters) => {
    return await model.findOne(filters).populate("franchisee_id").populate("employee").exec()
}