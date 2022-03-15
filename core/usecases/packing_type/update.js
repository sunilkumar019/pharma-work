//import model
const model = require("../../models/packing_type");
const getPackingTypes = require("./get");

module.exports = async (packingTypeId,data) => {


    let oldTypes =  await getPackingTypes({name: data.name});
    if(oldTypes.length>0) throw new Error("Packing Type Already Exists");
    
    let updateResponse = await model.updateOne({ _id: packingTypeId }, { $set: data }).exec() 
   if(updateResponse.ok == 1){
    return await getPackingTypes({_id:packingTypeId});
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}