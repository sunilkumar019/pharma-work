const mongoose = require('mongoose')

const product_typeSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:{ type: String, required: [true, "Product Type is Required"] },
    active:{ type: Boolean, default: true },
});

module.exports = mongoose.model('Product_types', product_typeSchema)