//import model
const model = require("../../models/franchisee");
const mongoose = require("mongoose");
//delete a franchisee
module.exports = async (franchiseeId) => {
    let updateResponse = await model.deleteOne({ _id: franchiseeId }).exec() 
    if(updateResponse.ok == 1){
    return {Message:"Franchisee deleted!!!"}
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}