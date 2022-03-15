const mongoose = require('mongoose')

const franchiseeSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name:{ type: String, required: [true, "Franchisee Name is Required"] },
  gst_number:{ type: String, default:"NA" },
  drug_license:{ type: String, default:"NA" },
  phone :{ type: String, default:null },
  email :{ type: String, default: null },
  address :{ type: String, default: null },
  state:{ type: String, default: null },
  district:{ type: String, default: null },
  divisions:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'Division',
      required:[true, "Division Id is Required"]
    }
  ],
  logo_url:{ type: String, default:null },
  bank_acc_no:{type:String,default:null},
  bank_ifsc:{type:String,default:null},
  bank_name:{type:String,default:null},
  bank_payee_name:{type:String,default:null},
  active:{ type: Boolean, default: false },
  created_on: {type: Date, default: Date.now},
  modified_on: {type: Date, default: Date.now}
});

// franchiseeSchema.path('email').validate((val) => {
//   emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   return emailRegex.test(val);
// }, 'Invalid Franchisee E-mail');

module.exports = mongoose.model('Franchisee', franchiseeSchema)
