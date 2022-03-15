const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: [true, "Customer Name is Required"] },
    city: { type: String },
    state: { type: String },
    address: { type: String, default: "NA" },
    phone: { type: Number, required: [true, "Customer Phone Number is Required"] },
    email: { type: String, default: "NA" },
    active: { type: Boolean, default: true },
    profession: { type: String, default: "NA" },
    rep_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Rep', required: [true, "Rep Id is Required"] },
    franchisee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Franchisee", required: [true, "Franchisee Id is required"] },
    working_place: { type: String, default: null },
    dob: { type: Date, default: null },
    wedding_anniversary: { type: Date, default: null },
    created_on: { type: Date, default: Date.now }
});

customerSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid Customer E-mail');

module.exports = mongoose.model('Customer', customerSchema)