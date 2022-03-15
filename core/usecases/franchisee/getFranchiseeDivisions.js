//import model
const model = require("../../models/franchisee");

//get franchisee Divisions 
module.exports = async (franchiseeId) => {
  
  let rs =  await model.findOne({_id:franchiseeId}).select("divisions").exec()

  if (rs !== null) {
    return rs.divisions;
  }
  else {
    rs
  }

  
  
}