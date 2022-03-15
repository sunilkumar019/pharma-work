//import model
const model = require("../../models/stateCity");
const deleteCity = require("../../usecases/stateCity/deleteCity");
const addCity = require("../../usecases/stateCity/addCity");
//update a city 
module.exports = async (stateId,cityName,cityOldName) => {
    let updateResponse = await deleteCity(stateId,cityOldName)
    if(updateResponse.message){
    return await addCity(stateId,cityName);
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}


// if(updateResponse.ok ==1)
//     updateResponseRes++;
// }