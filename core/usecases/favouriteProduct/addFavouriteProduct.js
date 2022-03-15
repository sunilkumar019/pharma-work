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

function arr_common(arr1, arr2) {
  var newArr = [];
  newArr = arr1.filter(function(v){ return arr2.indexOf(v) >= 0;})
  newArr.concat(arr2.filter(function(v){ return newArr.indexOf(v) >= 0;}));

  return newArr;
}

//save a pavourite Product
module.exports = async (favProduct) => {
  
  let repId = favProduct.rep_id;
  let productsIds = favProduct.products;
  let productsList = productsIds;

  let existingProducts = await model.findOne({"rep_id":new mongoose.Types.ObjectId(repId)}).select("_id products").exec();

  if(existingProducts){
    productsFromMongo = existingProducts.products;

    productsFromMongo = productsFromMongo.map(function(item) {
      return item.toString();
    });

    productsList = arr_diff(productsFromMongo,productsIds).concat(arr_common(productsFromMongo,productsIds));

    const id = existingProducts._id;
    const updateOps = {products:productsList};
    let rs =  await model.updateOne({ _id: id }, { $set: updateOps });
    if(rs.ok ==1){
      //return await model.find({_id:id});
      return {message:"Products added"}
    }
    else{
      return {Error: "Something went wrong!!!"}
    }
  }
  else{
    let favId = new mongoose.Types.ObjectId();
    let pro = new model({
      _id: favId,
      rep_id : repId,
      products:productsList
    });

    let res = await pro.save();
    return {message:"Products added"}
  }










}