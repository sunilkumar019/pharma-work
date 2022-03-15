//import model
const model = require("../../models/favouriteProducts");
 
module.exports = async (filters) => {
  let res =  await model.findOne(filters)
  .select("_id products rep_id")
  .exec()
  if(res)
    return {count:res.products.length};
  else
    return {count:0}
}