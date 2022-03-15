//import model
const model = require("../../models/stateCity");
//update a state 
module.exports = async (stateId,data) => {
    let updateResponse = await model.updateOne({ _id: stateId }, { $push: {cities:data} }).exec() 
   if(updateResponse.ok == 1){
    return {Message:"city added!!!"}
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}


// if(updateResponse.ok ==1)
//     updateResponseRes++;
// }