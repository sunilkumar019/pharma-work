const mongoose = require('mongoose')

const product_categorySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:{ type: String, required:[true, "Product Category Name is Required"] },
    active:{ type: Boolean, default: true },
});

module.exports = mongoose.model('Product_category', product_categorySchema)