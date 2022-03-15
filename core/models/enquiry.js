const mongoose = require('mongoose')

const enquirySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name:{ type: String, required: [true,"Name is Required"] },
  email:{ type: String, default: null },
  phone:{ type: String, required: [true,"Phone Number is Required"] },
  message:{ type: String, default: null },
  created_on: {type: Date, default: Date.now},
  modified_on: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Enquiry', enquirySchema)