//import model
const model = require("../../models/employee");
//update a offer 
module.exports = async (employeeID, data) => {
    let updateResponse = await model.updateOne({ _id: employeeID }, { $set: data }).exec()
    if (updateResponse.ok == 1) {
        return { Message: "Employee Updated" }
    }
    else {
        return { Error: "Something went wrong!!!" }
    }
}