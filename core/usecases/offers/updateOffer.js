//import model
const model = require("../../models/offers");
//update a offer 
module.exports = async (offerId, data) => {
    let updateResponse = await model.updateOne({ _id: offerId }, { $set: data }).exec()
    if (updateResponse.ok == 1) {
        return { Message: "Offer Updated" }
    }
    else {
        return { Error: "Something went wrong!!!" }
    }
}