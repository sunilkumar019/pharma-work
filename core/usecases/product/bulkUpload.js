//import model
const productModel = require("../../models/product");
const productDivisionModel = require("../../models/division");
const producyCategoryModel = require("../../models/product_category");
const productTypeModel = require("../../models/product_types");
const mongoose = require("mongoose");
const csv = require('csvtojson');
const fs = require('fs');
const lodash = require("lodash")

// ->csv to json return
async function convertcsvtojson(filePath) {

    filejson = await csv().fromFile(filePath)
    fs.unlinkSync(filePath);
    return filejson;
}
 
// Product  bulk upload from csv
module.exports = async(productFile) => {

    productsJsonData = await convertcsvtojson('./core/uploads/temp/' + productFile);
    let productDivision = await productDivisionModel.find().select("_id name").exec();
    let productCategories = await producyCategoryModel.find().select("_id name").exec();
    let productTypes = await productTypeModel.find().select("_id name").exec();
    ///////////////////////////////
    let uniqArr = lodash.uniqBy(productsJsonData, 'Name')

    if (uniqArr.length !== productsJsonData.length) {
        let duplicatesArr = lodash.difference(productsJsonData, uniqArr, 'Name');
        duplicatesArr = duplicatesArr.map(it => { return it.Name })
        duplicatesArr = duplicatesArr.toString();
        throw new Error("Products with these names are duplicate, please change products names, No duplicate is allowed " + duplicatesArr);
    }
    //////////////////////////
    let errorData = []
    for (let i = 0; i < productsJsonData.length; i++) { //tmp is i+2 because in excel rows start from 1
        let tmp = i + 2;

        if (productsJsonData[i].Name === undefined || productsJsonData[i].Name == "")
            errorData.push("Product Name Cannot be Empty. Error at Row NO: " + tmp)
        else
            productsJsonData[i].name = productsJsonData[i].Name;

        if (productsJsonData[i].Composition === undefined || productsJsonData[i].Composition == "")
            productsJsonData[i].description = "NA";
        else
            productsJsonData[i].description = productsJsonData[i].Composition;

        if (productsJsonData[i].Price === undefined || productsJsonData[i].Price == "")
            productsJsonData[i].price = 0;
        else
            productsJsonData[i].price = productsJsonData[i].Price;

        if (productsJsonData[i].Minimum_Order_Qty == undefined || productsJsonData[i].Minimum_Order_Qty == "")
            productsJsonData[i].min_order_qty = 1;
        else
            productsJsonData[i].min_order_qty = productsJsonData[i].Minimum_Order_Qty;

        if (productsJsonData[i].Packing == undefined || productsJsonData[i].Packing == "")
            productsJsonData[i].packing = null;
        else
            productsJsonData[i].packing = productsJsonData[i].Packing;

        if (productsJsonData[i].Packing_type == undefined || productsJsonData[i].Packing_type == "")
            productsJsonData[i].packing_type = null;
        else
            productsJsonData[i].packing_type = productsJsonData[i].Packing_type;

        if (productsJsonData[i].SKU == undefined || productsJsonData[i].SKU == "")
            productsJsonData[i].sku = null;
        else
            productsJsonData[i].sku = productsJsonData[i].SKU;

        if (productsJsonData[i].HSN_CODE == undefined || productsJsonData[i].HSN_CODE == "")
            productsJsonData[i].hsn_code = null;
        else
            productsJsonData[i].hsn_code = productsJsonData[i].HSN_CODE;

        if (productsJsonData[i].Details == undefined || productsJsonData[i].Details == "")
            productsJsonData[i].details = null;
        else
            productsJsonData[i].details = productsJsonData[i].Details;

        //to check division is not empty
        let rsdiv = productDivision.find(div => div.name.replace(/\s/g, "").toLowerCase() === productsJsonData[i].Division.replace(/\s/g, "").toLowerCase());
        if (rsdiv === undefined || rsdiv === " ")
            errorData.push("Add Division First. Error at Row NO: " + tmp)
        else
            productsJsonData[i].division_id = rsdiv._id

        //to check category is not empty
        let rscat = productCategories.find(div => div.name.replace(/\s/g, "").toLowerCase() === productsJsonData[i].Category.replace(/\s/g, "").toLowerCase());
        if (rscat === undefined || rscat === "")
            errorData.push("Add Category First. Error at Row NO: " + tmp)
        else
            productsJsonData[i].category_id = rscat._id

        //to check Type is not empty
        let rstype = productTypes.find(div => div.name.replace(/\s/g, "").toLowerCase() === productsJsonData[i].Type.replace(/\s/g, "").toLowerCase());
        if (rstype === undefined || rstype === "")
            errorData.push("Add Product Type First. Error at Row NO: " + tmp)
        else
            productsJsonData[i].type_id = rstype._id

        delete productsJsonData[i].Composition;
        delete productsJsonData[i].Type;
        delete productsJsonData[i].Division
        delete productsJsonData[i].Category
        delete productsJsonData[i].Name
        delete productsJsonData[i].Price
        delete productsJsonData[i].Minimum_Order_Qty
        delete productsJsonData[i].Packing
        delete productsJsonData[i].Packing_type
        delete productsJsonData[i].Details
        if(productsJsonData[i].SKU)delete productsJsonData[i].SKU
        if(productsJsonData[i].HSN_CODE)delete productsJsonData[i].HSN_CODE
    }

    if (errorData.length > 0)
        throw new Error(errorData);
    else {
        let insertionerror = [];
        for (let i = 0; i < productsJsonData.length; i++) {
            productSave = new productModel({ _id: new mongoose.Types.ObjectId() })
            productSave.set(productsJsonData[i])
            let rs = await productSave.save(function(err, done) {
                if (err) insertionerror.push(err);
            })

        }

        if (insertionerror.length > 0)
            throw new Error(insertionerror);
        else
            return { message: "Product list uploaded" }
    }
}
