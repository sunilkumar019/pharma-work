//import model
const model = require("../../models/favouriteProducts");

//get division 
module.exports = async (filters) => {
  return await model.findOne(filters)
      .select("_id products rep_id")
      .populate({path: "products", populate: { path: "products", match: { active: { $eq: true }}}})
      .populate({path: 'products', populate: {path: 'products', path: 'division_id', select: "name"}})
      .populate({path: 'products', populate: {path: 'products', path: "category_id", select: "name"}})
      .populate({path: 'products', populate: {path: 'products', path: "type_id", select: "name"}})
      .exec()
}