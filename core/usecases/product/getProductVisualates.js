//import model
const model = require("../../models/product");

//get product  Visualates
module.exports = async(filters) => {
    let newFilter = {...filters, 'images.type': 'VIS' }

    let products = await model.find(newFilter).select("images").lean().sort({ name: 1 }).exec();

    let allImages = []
    products.forEach(product => {
        allImages = allImages.concat(product.images)
    })

    const visualates = allImages.filter(img => img.type === 'VIS')
    return visualates;
}