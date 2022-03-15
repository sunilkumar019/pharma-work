const mongoose = require('mongoose')

const packing_typeSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:{ type: String, required:[true, "Name is Required"] }
});

module.exports = mongoose.model('Packing_type', packing_typeSchema)