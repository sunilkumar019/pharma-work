//import model
const model = require("../../models/offers");

//delete a offer
module.exports = async (offerId) => {
    let deleteResponse = await model.remove({ _id: offerId }).exec() 
    if(deleteResponse.ok == 1){
    return {Message:"Offer deleted!!!"}
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}

//needs to be checked