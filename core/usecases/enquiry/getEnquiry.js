//import model
const model = require("../../models/enquiry");
 
module.exports = async (filters) => {
  let skip = filters.skip ? filters.skip : 0;
  let limit = filters.limit ? filters.limit : 100;
  delete filters.skip;
  delete filters.limit;

  if(filters.search){
    filters.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { email: { $regex: filters.search, $options: 'i' } },
      { phone: { $regex: filters.search, $options: 'i' } },
      { message: { $regex: filters.search, $options: 'i' } }
    ]

    delete filters.search;
  }
  return await model.find(filters).sort({created_on:-1}).skip(skip).limit(limit).exec()
}