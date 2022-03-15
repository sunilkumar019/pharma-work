//import model
const model = require("../../models/admin");
const getAdmin = require("./getAdmin");
//update a admin 
module.exports = async (adminId,data) => {
    let updateResponse = await model.updateOne({ _id: adminId }, { $set: data }).exec() 
   if(updateResponse.ok == 1){
    return await getAdmin({_id:adminId});
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}