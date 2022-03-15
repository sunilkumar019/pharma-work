const mongoose = require('mongoose')

const favproductSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  rep_id:{ type:mongoose.Schema.Types.ObjectId,ref:'Rep',required:"Rep Id is required"},
  products:[{ type:mongoose.Schema.Types.ObjectId,ref:'Product',required:"Products Id required"}],
});

module.exports = mongoose.model('FavouriteProducts', favproductSchema)

