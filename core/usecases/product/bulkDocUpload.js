//import model
const productModel = require("../../models/product");
const mongoose = require("mongoose");
const fs = require('fs');
var xor = require('lodash.xor');
var uniq = require('lodash.uniq');
// Product images bulk upload
const moveFile = require('move-file');

module.exports = async(productTechDetailDocs) => {

    //fetching all products from db
    let products = await productModel.find().select("_id name").lean().exec();
    //mapping all products return id and name
    products = await products.map(it => {
            return {
                id: it._id,
                name: (it.name).replace(/[!@#$%^&*,?"':;{}|<>_+=\-\[\]\\/\s]+/g, '').toLowerCase()
            }
        })
        //storing docs from temp folder to dedicated folder
    for (let i = 0; i < productTechDetailDocs.length; i++) {
        productTechDetailDocs[i].originalname = (productTechDetailDocs[i].originalname).replace(/(#)/, "")
        moveFile.sync(productTechDetailDocs[i].path, "./core/uploads/products/techDetails/" + productTechDetailDocs[i].originalname)
        productTechDetailDocs[i].path = "core/uploads/products/techDetails/" + productTechDetailDocs[i].originalname
    }

    //removing extra spaces and special characters from file names returns name,path
    productTechDetailDocs = await productTechDetailDocs.map(it => {
        let doc_name = (it.filename).replace(/[!$%^&*,?"':;{}|<>_+=\-\[\]\\/\s]+/g, '').toLowerCase().replace(/(.docx|.doc|.pdf)/, "")

        let doc_arr = [];

        if (doc_name.includes("@@")) {
            doc_arr = doc_name.split("@@");
            let output_doc_arr = [];
            for (let i = 0; i < doc_arr.length; i++) {
                output_doc_arr.push({
                    name: doc_arr[i],
                    path: it.path
                })
            }
            return output_doc_arr;
        } else {
            return {
                name: doc_name,
                path: it.path
            }
        }
    })

    //flat array
    productTechDetailDocs = flatten(productTechDetailDocs);
    let DocstoUpload = [];
    let productsIds = [];
    //matching doc with product name, if matched pushed to DocstoUpload array and ProductsIds array
    for (let i = 0; i < products.length; i++) {
        for (let j = 0; j < productTechDetailDocs.length; j++) {
            if (products[i].name == productTechDetailDocs[j].name) {
                DocstoUpload.push(productTechDetailDocs[j].path);
                productsIds.push({ id: products[i].id });
            }
        }
    }
    let tmpdocs = [];
    //pushing doc path to tmpdocs
    productTechDetailDocs.map(it => {
        tmpdocs.push(it.path)
    })

    let tmpmatcheddocs = [];
    //pushing matched docs  to tmpmatcheddocs array
    DocstoUpload.map(it => {
            tmpmatcheddocs.push(it)
        })
        //removing images that do not matched
    let docsToRemove = xor(tmpdocs, tmpmatcheddocs)
    for (let i = 0; i < docsToRemove.length; i++)
        fs.unlinkSync(docsToRemove[i]);
    //updating product collection by adding image path with matched product
    let updateResponseRes = 0;

    for (let i = 0; i < productsIds.length; i++) {
        let updateResponse = await productModel.updateOne({ _id: productsIds[i].id }, { $set: { technical_detail: DocstoUpload[i] } }).exec()
        if (updateResponse.ok == 1)
            updateResponseRes++;
    }
    tmpmatcheddocs = [...new Set(tmpmatcheddocs)]
    return {
        ResponseFromDb: updateResponseRes,
        DocsIgnoredCount: docsToRemove.length,
        DocsUploadedCount: tmpmatcheddocs.length,
        DocsIgnored: docsToRemove.map(it => { return it.replace("core/uploads/products/techDetails", "") }),
        DocsUploaded: tmpmatcheddocs.map(it => { return it.replace("core/uploads/products/techDetails", "") }),
    };
}

var flatten = function(a, shallow, r) {
    if (!r) { r = [] }

    if (shallow) {
        return r.concat.apply(r, a);
    }

    for (let i = 0; i < a.length; i++) {
        if (a[i].constructor == Array) {
            flatten(a[i], shallow, r);
        } else {
            r.push(a[i]);
        }
    }
    return r;
}