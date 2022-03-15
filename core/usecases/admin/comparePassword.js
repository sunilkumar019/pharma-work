//import model
const model = require("../../models/admin");
const bcrypt = require("bcrypt")

//compare password
module.exports = async (id,oldPassword) => {
  let res =  await model.findOne({_id:id}).select("password_hash").exec();
  passwordRes =  bcrypt.compareSync(oldPassword, res.password_hash);
  return passwordRes;
}