const mongoose = require('mongoose')

const offersSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title:{ type:String,required:[true, "Offer Title is Required"]},
  description:{ type:String,default:null},
  image:[{type:String,default:null}],
  reps: [{type: mongoose.Schema.Types.ObjectId, ref: 'Rep'}],
  division: [{type: mongoose.Schema.Types.ObjectId, ref: 'Division'}],
  valid_upto: {type: Date, required:true},
  created_on: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Offers', offersSchema)


