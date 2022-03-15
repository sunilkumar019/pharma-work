const mongoose = require('mongoose')

const state_districtSchema = new mongoose.Schema({
  name:{ type: String, required: [true, "State Name is Required"] },
  cities:[
    {
      type:String
    }
  ]
});
module.exports = mongoose.model('state_and_district', state_districtSchema)
