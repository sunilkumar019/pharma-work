//import model
const model = require("../../models/rep");

//get reps
module.exports = async (filters) => {

    let skip = filters.skip;
    let limit = filters.limit;
    delete filters.skip;
    delete filters.limit;

    if (filters.email) {
        filters.email = { "$regex": filters.email, "$options": "i" }
    }

    if (filters.phone) {
        filters.phone = { "$regex": `${filters.phone}`, "$options": "i" }
    }

    if (filters.search) {
        filters.$or = [{ name: { $regex: filters.search, $options: 'i' } }, { state: { $regex: filters.search, $options: 'i' } }, { city: { $regex: filters.search, $options: 'i' } }]
    }
    if (filters.searchBy) {
        let regex = new RegExp((filters.searchBy.value).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi')
        filters.$or = [{ [filters.searchBy.key]: regex }];
    }
    delete filters.search;
    delete filters.searchBy;

    let rs = await model.find(filters).populate("franchisee_id").populate("employee").skip(skip).limit(limit).sort({ created_on: -1 }).exec()

    return rs


}