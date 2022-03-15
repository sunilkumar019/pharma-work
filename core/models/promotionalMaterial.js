const mongoose = require('mongoose')

const promotionalMaterialSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title:{ type: String, required: [true, 'Title is Required']},
  description:{ type: String, default: null},
  image:{ type: String, default: null},
  created_on: {type: Date, default: Date.now},
  modified_on: {type: Date, default: Date.now}
});
module.exports = mongoose.model('promotional_material', promotionalMaterialSchema)