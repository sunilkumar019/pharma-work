//import model
const model = require("../../models/favouriteProducts");
const mongoose = require("mongoose");
function arr_diff (a1, a2) {

    var a = [], diff = [];
  
    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }
  
    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }
  
    for (var k in a) {
        diff.push(k);
    }
  
    return diff;
  }
  

module.exports = async (favProduct) => {

    let repId = favProduct.rep_id;
    let productsIds = favProduct.products;
    let productsList = productsIds;


  let existingProducts = await model.findOne({"rep_id":new mongoose.Types.ObjectId(repId)}).select("_id products").exec();

    productsFromMongo = existingProducts.products;

    productsFromMongo = productsFromMongo.map(function(item) {
      return item.toString();
    });

    productsList = arr_diff(productsFromMongo,productsIds);

    const id = existingProducts._id;
    const updateOps = {products:productsList};
    let updateResponse = await model.updateOne({ _id: id }, { $set: updateOps }).exec()
    if(updateResponse.ok == 1){
        return {Message:"Products deleted!!!"}
    }
    else{
        return {Error: "Something went wrong!!!"}
    }
    












}