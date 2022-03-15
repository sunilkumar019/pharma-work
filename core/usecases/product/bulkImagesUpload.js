//import model
const productModel = require("../../models/product");
const mongoose = require("mongoose");
const fs = require('fs');
var xor = require('lodash.xor');
var uniq = require('lodash.uniq');
// Product images bulk upload
const moveFile = require('move-file');

const sizeOf = require('image-size');

const IMG_SIZE = process.env.IMG_SIZE || 40000; //40KB
const VIS_SIZE = process.env.VIS_SIZE || 120000; //120KB

const IMG_HEIGHT = process.env.IMG_HEIGHT || 500; //500PX
const IMG_WIDTH = process.env.IMG_WIDTH || 500; //500PX

const VIS_HEIGHT = process.env.VIS_HEIGHT || 4000; //4000PX
const VIS_WIDTH = process.env.VIS_WIDTH || 1000; //1000PX



module.exports = async (productImages,imagesType) => {

    let picsUploadError = [];
    //checking the images type
    if(imagesType != "IMG" && imagesType != "VIS")
        imagesType = "IMG"
    //fetching all products from db
    let products = await productModel.find().select("_id name").lean().exec();
    //mapping all products
    products = await products.map(it=>{
        return {
        id: it._id,
        name: (it.name).replace(/[!@#$%^&*,?"':;{}|<>_+=\-\[\]\\/\s]+/g,'').toLowerCase()
        }
    });
    //storing images from temp folder to dedicated folder as per the type
    if(imagesType == "IMG"){

        for(let i=0;i<productImages.images.length;i++){
            productImages.images[i].originalname   = (productImages.images[i].originalname).replace(/(#)/,"")
            moveFile.sync(productImages.images[i].path,"./core/uploads/products/img/"+productImages.images[i].originalname)
            productImages.images[i].path = "core/uploads/products/img/"+productImages.images[i].originalname
        }
    }
    else{
        for(let i=0;i<productImages.images.length;i++){
            productImages.images[i].originalname   = (productImages.images[i].originalname).replace(/(#)/,"")
            moveFile.sync(productImages.images[i].path,"./core/uploads/products/vis/"+productImages.images[i].originalname)
            productImages.images[i].path = "core/uploads/products/vis/"+productImages.images[i].originalname
        }
    }
    //removing extra spaces and special characters from images names and return image name and path
    productImages = await productImages.images.map(it=>{  
        let img_name = (it.filename).replace(/[!$%^&*,?"':;{}|<>_+=\-\[\]\\/\s]+/g,'').toLowerCase().replace(/(.jpg|.png|.jpeg)/,"")
        img_name = img_name.split('#')[0];
        let img_arr = [];
        
        if(img_name.includes("@@")){
            img_arr = img_name.split("@@");
           let output_img_arr =[];
            for(let i=0;i<img_arr.length;i++){
              output_img_arr.push({name:img_arr[i],path:it.path})
            }
            return output_img_arr;
        }
        else{
          return {
            name : img_name,
            path : it.path
        }
        } 
    })

    //flat array
    productImages = flatten(productImages);

    let PicstoUpload = [];
    let productsIds = [];
    //matching image with product name, if matched pushed to PicstoUpload array and ProductsIds array
    for(let i = 0;i<products.length;i++){
        for(let j=0;j<productImages.length;j++){
            if(products[i].name == productImages[j].name){
                
                let sizeValid = true;
                let resolutionValid = true;

                let pic_dimensions = sizeOf(productImages[j].path);

                if(imagesType == "IMG"){


                    if(productImages[j].size > IMG_SIZE){
                        picsUploadError.push(`${productImages[j].name} has Size more than ${parseInt(IMG_SIZE/1024)}KB`);
                        sizeValid = false;
                    }

                    if(pic_dimensions.height > IMG_HEIGHT || pic_dimensions.width > IMG_WIDTH){
                        picsUploadError.push(`${productImages[j].name} has Dimensions more than ${IMG_HEIGHT} * ${IMG_WIDTH}`);
                        resolutionValid = false;
                    }
                }
                else{
                    if(productImages[j].size > VIS_SIZE){
                        picsUploadError.push(`${productImages[j].name} has Size more than ${parseInt(VIS_SIZE/1024)}KB`);
                        sizeValid = false;
                    }

                    if(pic_dimensions.height > VIS_HEIGHT || pic_dimensions.width > VIS_WIDTH){
                        picsUploadError.push(`${productImages[j].name} has Dimensions more than ${VIS_HEIGHT} * ${VIS_WIDTH}`);
                        resolutionValid = false;
                    }
                }

                if(sizeValid && resolutionValid){
                    PicstoUpload.push({type: imagesType, url: productImages[j].path});
                    productsIds.push({id:products[i].id});
                }
                
            }
        }
    }
    let tmpimages = [];
    //pushing image path to tmpimages
    productImages.map(it =>{
        tmpimages.push(it.path)
    })

    let tmpmatchedimages =[];
    //pushing matched images url to tmpmatchedimages array
    PicstoUpload.map(it =>{
        tmpmatchedimages.push(it.url)
    })
    //removing images that do not matched
    let picsToRemove = xor(tmpimages,tmpmatchedimages)
    for(let i=0;i<picsToRemove.length;i++)
        fs.unlinkSync(picsToRemove[i]);
    //updating product collection by adding image path with matched product
    let updateResponseRes =0;

    for(let i=0;i<productsIds.length;i++){
         let updateResponse = await productModel.updateOne({ _id: productsIds[i].id }, { $push: {images:PicstoUpload[i]} }).exec() 
         if(updateResponse.ok ==1)
            updateResponseRes++;
    }
   tmpmatchedimages = [...new Set(tmpmatchedimages)]

    return {
        ResponseFromDb:updateResponseRes,
        PicsIgnoredCount:picsToRemove.length,
        PicsUploadedCount:tmpmatchedimages.length,
        PicsIgnored: picsToRemove.map(it=>{return it.replace("core/uploads/products/","")}),
        PicsUploaded:tmpmatchedimages.map(it=>{return it.replace("core/uploads/products/","")}),
        PicsUploadError: picsUploadError
    };
}

var flatten = function(a, shallow,r){
    if(!r){ r = []}
     
  if (shallow) {
    return r.concat.apply(r,a);
    }
        
     for(let i=0; i<a.length; i++){
          if(a[i].constructor == Array){
              flatten(a[i],shallow,r);
          }else{
              r.push(a[i]);
          }
      }
      return r;
  }
