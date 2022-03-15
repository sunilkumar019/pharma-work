//import model
const model = require("../../models/stateCity");
//delete a city 
module.exports = async (stateId,cityName) => {
    let updateResponse = await model.findByIdAndUpdate({ _id: stateId }, {$pull: {cities: cityName}}).exec() 
    if(updateResponse){
    return {message:"Successfull!!"}
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}
