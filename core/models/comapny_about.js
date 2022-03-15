const mongoose = require('mongoose')

const copantAboutSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  phone:{ type: String, required: [true, 'Company Phone is Required']},
  whatsapp:{ type: String, required: [true, 'Company Whatsapp is Required']},
  website:{ type: String, required: [true, 'Company Website is Required']},
  email:{ type: String, required: [true, 'Company Email is Required']},
  about:{ type: String, required: [true, 'Company About Content is Required']},
  address:{ type: String, required: [true, 'Company Address is Required']},
  address2:{ type: String, default: null},
  address3:{ type: String, default: null},
  address4:{ type: String, default: null},
  download_links: [{
    division_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Division', required: [true, "Division Id is Required"]},
    product_list_link: {type: String, required: [true, "Product list link is Required"]},
    visualaids_link: {type: String, required: [true, "Visual-aids link is Required"]}
  }],
  about_img: {type: String, default: null},  
  facebook:{ type: String, default: null},
  twitter:{ type: String, default: null},
  pinterest:{ type: String, default: null},
  linkedin:{ type: String, default: null},
  whatsapp_greeting: {type: String, default: null},
  corporate_video:{ type: String, default: null},
  created_on: {type: Date, default: Date.now},
  modified_on: {type: Date, default: Date.now}
});
module.exports = mongoose.model('Company_about', copantAboutSchema)