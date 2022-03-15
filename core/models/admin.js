const mongoose = require('mongoose')
const crypto = require('crypto')
const moment = require("moment")

const adminSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name:{ type: String, required: [true,"Admin Name is Required"] },
  email:{ type: String, required: [true,"Admin Email is Required"] },
  phone:{ type: String, required: [true,"Admin Phone Number is Required"] },
  company:{ type: String, required: [true,"Company Name is Required"] },
  password_hash:{ type: String, required: [true,"Admin Password is Required"] },
  profile_pic:{ type: String, default:null },
  created_on: {type: Date, default: Date.now},
  modified_on: {type: Date, default: Date.now},
  token: {type: String, required: false, default: ''},
  token_expire_in: { type: Date, required: false, default: moment().format()}
});
adminSchema.path('email').validate((val) => {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(val);
}, 'Invalid Admin E-mail');

// Generate password reset token
adminSchema.methods.getResetPasswordToken = function(){
  //Generate token
  const resetToken = crypto.randomBytes(64).toString('hex');

  //Hash and set to resetPasswordToken
  this.token = crypto.createHash('sha256').update(resetToken).digest('hex')

  const time = moment().add(1, 'day').format()
  //Set token expire time
  this.token_expire_in = time;

  return resetToken
}

module.exports = mongoose.model('Admin', adminSchema)