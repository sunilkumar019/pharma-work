//import model
const model = require("../../models/comapny_about");


module.exports = async () => {
  return await model.find()
  .populate('download_links.division_id')
  .exec()
  //
}