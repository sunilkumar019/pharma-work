const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name:{ type: String, required: [true,"Name is Required"] },
  email:{ type: String, default: null },
  phone:{ type: String, default:  null },
  address:{ type: String, default: null },
  created_on: {type: Date, default: Date.now},
  modified_on: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Employee', employeeSchema)