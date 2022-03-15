//import model
const model = require("../../models/certificates");
const fs = require("fs");
module.exports = async (id) => {
    let data = await model.findOne({_id:id});
    if(!data) return {Error: "No Certifcate found"};
    if(data.image)fs.unlinkSync(data.image)
    let deleteResponse = await model.remove({ _id: id }).exec() 
    if(deleteResponse.ok == 1){
    return {Message:"Certificate deleted!!!"}
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}