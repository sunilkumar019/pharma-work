const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    //customer_id: { type:mongoose.Schema.Types.ObjectId,ref:'Customer',required:[true, "Customer Id is Required"]},
    rep_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Rep', required: [true, "Rep Id is Required"] },
    franchisee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Franchisee', required: [true, "Franchisee Id is Required"] },
    orderlist: [{
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: [true, "Product Id is Required"] },
        quantity: { type: Number, required: [true, "Product Quantity is Required"] },
        packing_type: { type: String, default: null }
    }],
    created_on: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer_Order', orderSchema)