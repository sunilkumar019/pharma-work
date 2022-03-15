const mongoose = require('mongoose')

const repSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    franchisee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Franchisee', required: [true, "Rep Franchisee Id is Required"] },
    name: { type: String, required: [true, "Rep Name is Required"] },
    email: { type: String, default: '' },
    phone: { type: String, required: [true, "Rep Phone Number is Required"] },
    aadhar_no: { type: String, default: null },
    city: { type: String },
    state: { type: String },
    address: { type: String, default: null },
    dob: { type: Date, default: null },
    op_area: { type: String, default: "NA" },
    joined_on: { type: Date },
    profile_pic_url: { type: String, default: null },
    password_hash: { type: String, required: [true, "Rep Password is Required"] },
    active: { type: Boolean, default: false },
    is_owner: { type: Boolean, default: false },
    device_token: { type: String, default: null },
    created_on: { type: Date, default: Date.now },
    modified_on: { type: Date, default: Date.now }
});
// repSchema.path('email').validate((val) => {
//     emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return emailRegex.test(val);
// }, 'Invalid Rep E-mail');

module.exports = mongoose.model('Rep', repSchema)