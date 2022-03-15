const model = require("../../models/company_order");
// const mongoose = require('mongoose')

module.exports = async(filters) => {

    // let searchFilters = {...filters};
    // if(filters._id) 
    // searchFilters._id = mongoose.Types.ObjectId(`${filters._id}`);

     let rs =  await model.find(filters).populate({path:"orderlist.product_id",populate:{path:"division_id",select:"name"}}).exec()

    return rs

}

