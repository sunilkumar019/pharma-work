//import model
const model = require("../../models/customer");

//get customer 
module.exports = async(filters) => {
    let skip = 0;
    let limit = 1000;
    if(filters.limit) limit = filters.limit;
    if(filters.skip) skip = filters.skip;
    delete filters.skip;
    delete filters.limit;
    if (filters.search) {
        filters.$or = [{ profession: { $regex: filters.search, $options: 'i' } }, { name: { $regex: filters.search, $options: 'i' } }, { state: { $regex: filters.search, $options: 'i' } }, { city: { $regex: filters.search, $options: 'i' } }]
    }
    delete filters.search;
    return await model.find(filters).populate("rep_id").populate("franchisee_id").skip(skip).limit(limit).exec()
}