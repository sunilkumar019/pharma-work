//import model
const model = require("../../models/company_order");
//get order
module.exports = async (filters) => {
    return await model
        .find(filters)
        .populate("rep_id")
        .populate({path: "orderlist.product_id", populate: {path: "division_id", select: "name"}})
        .populate({path: "orderlist.product_id", populate: {path: "type_id", select: "name"}})
        .populate({path: "orderlist.product_id", populate: {path: "category_id", select: "name"}})
        .sort({created_on: -1})
        .exec()
}