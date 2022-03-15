//import model
const model = require("../../models/order");
const mongoose = require("mongoose");
const getOrders = require("./getOrders");
//save a order
module.exports = async (order) => {
  order._id = new mongoose.Types.ObjectId();
  return (await new model(order).save()).toObject();  
}

