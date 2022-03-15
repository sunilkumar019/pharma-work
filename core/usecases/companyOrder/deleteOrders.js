//import model
const model = require("../../models/company_order");

module.exports = async (query) => {
    let updateResponse = await model.deleteMany(query).exec()
    if(updateResponse.ok == 1){
        return {Message:"Orders deleted!!!"}
    }
    else{
        return {Error: "Something went wrong!!!"}
    }
}