//import model
const model = require("../../models/product");
const fs = require("fs");

//count product  Visualates
module.exports = async (filters) => {
    let newFilter = {...filters, 'images.type': 'VIS' }
    
  let products =  await model.find(newFilter).select("images").lean().exec();
  
  let allImages = []
  products.forEach(product => {
    allImages = allImages.concat(product.images)
  })
  const visualates = allImages.filter(img => img.type === 'VIS' && fs.existsSync(img.url)).length;
  return {count: visualates};
}