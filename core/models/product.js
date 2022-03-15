const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    division_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Division', required: [true, "Product Division Id is Required"] },
    type_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product_types', required: [true, "Product Type Id is Required"] },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product_category', required: [true, "Product Category Id is Required"] },
    name: { type: String, required: [true, "Product Name is Required"] },
    price: { type: Number, required: [true, "Product Price is Required"] },
    description: { type: String, required: [true, "Product Description is Required"] }, //used as composition
    details: { type: String, default: null }, //description
    min_order_qty: { type: Number, default: 1 },
    images: [{
        url: { type: String, required: [true, "Product Image/Visual-aid Url is Required"] },
        type: { type: String, enum: ['IMG', 'VIS'], required: [true, "product Image Type (img/vis) is Required"] }
    }],
    technical_detail: { type: String, default: null },
    new_launched: { type: Boolean, default: false },
    upcoming: { type: Boolean, default: false },
    packing: { type: String, default: null },
    packing_qty: { type: Number, default: 1 },
    packing_type: { type: String, default: null },
    active: { type: Boolean, default: true },
    sku: {type: String, default: null},
    hsn_code: {type: String, default: null},
    created_on: { type: Date, default: Date.now },
    modified_on: { type: Date, default: Date.now },
    deleted: { type: Number, default: 0}
});
module.exports = mongoose.model('Product', productSchema)

