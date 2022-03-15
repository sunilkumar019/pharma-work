//import model
const model = require("../../models/customer");
const mongoose = require("mongoose");
const getcustomer = require("./getCustomers");
//save a Customer
module.exports = async (customer) => {
  customer._id = new mongoose.Types.ObjectId();
  let customerRecords = await getcustomer({email:customer.email});
  if(customerRecords.length>0){
     throw new Error("Customer already Exists!!!");
  }
    
  return (await new model(customer).save()).toObject();  
}