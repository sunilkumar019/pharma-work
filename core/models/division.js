const mongoose = require('mongoose')

const divisionSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:{ type: String, required: "Division Name is Required" },
    address:{ type: String, default:"NA" },
    email:{ type: String, default:"NA" },
    phone:{ type: String, default:"NA" },
    active:{ type: Boolean, default: true },
    created_on: {type: Date, default: Date.now},
    modified_on: {type: Date, default: Date.now}
});


module.exports = mongoose.model('Division', divisionSchema)