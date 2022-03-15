//import model
const model = require("../../models/customer");

//get customer 
module.exports = async() => {
    return await model.countDocuments().exec()
}