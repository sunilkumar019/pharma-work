//import model
const model = require("../../models/admin");
const mongoose = require("mongoose");
//const getAdmin = require("./getAdmin");
//save a Admin
module.exports = async (admin) => {
  admin._id = new mongoose.Types.ObjectId();
  // let adminRecords = await getAdmin({email:admin.email});
  // if(adminRecords.length>0){
  //    throw new Error("admin already Exists!!!");
  // }
    
  return (await new model(admin).save()).toObject();  
}

