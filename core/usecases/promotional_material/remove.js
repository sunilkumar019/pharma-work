//import model
const model = require("../../models/promotionalMaterial");

module.exports = async (Id) => {
    let deleteResponse = await model.remove({ _id: Id }).exec() 
    if(deleteResponse.ok == 1){
    return {Message:"Entry deleted!!!"}
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}

//needs to be checked