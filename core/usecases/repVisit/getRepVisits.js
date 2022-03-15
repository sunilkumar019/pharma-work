//import model
const model = require("../../models/repVisit");

//get rep Visit
module.exports = async(filters) => {
    if (filters.search) {
        filters.$or = [{ place: { $regex: filters.search, $options: 'i' } }, { remark: { $regex: filters.search, $options: 'i' } }]
    }
    delete filters.search;

    let skip = filters.skip || 0;
    let limit = filters.limit || 20;
    delete filters.skip;
    delete filters.limit;

    return await model
        .find(filters)
        .populate("rep_id")
        .populate("customer_id")
        .populate({ path: 'products', populate: { path: 'products', path: 'division_id', select: "name" } })
        .populate({ path: 'products', populate: { path: 'products', path: "category_id", select: "name" } })
        .populate({ path: 'products', populate: { path: 'products', path: "type_id", select: "name" } })
        .skip(skip)
        .limit(limit)
        .sort({ created_on: -1 })
        .exec()
}