const mongoose = require('mongoose')

const repVisitSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    rep_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Rep', required: [true, "Rep Id is Required"] },
    franchisee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Franchisee', required: [true, "Franchisee Id is Required"] },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: [true, "Customer Id is Required"] },
    place: { type: String, required: [true, "Meeting Place is Required"] },
    remark: { type: String, required: [true, "Remarks are Required"] },
    time: { type: Date, required: [true, "Meeting Date-Time is Required"] },
    latitude: { type: String, default: null },
    longitude: { type: String, default: null },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null }],
    created_on: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RepVisits', repVisitSchema)