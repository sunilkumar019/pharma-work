//import use cases
//Product use cases
const addProduct = require("../usecases/product/addProduct");
const bulkUpload = require("../usecases/product/bulkUpload");
const bulkImagesUpload = require("../usecases/product/bulkImagesUpload");
const bulkDocsUplaod = require("../usecases/product/bulkDocUpload")
const deleteProduct = require("../usecases/product/deleteProduct");
const getProduct = require("../usecases/product/getProduct");
const getProductNames = require("../usecases/product/getProductNames");
const updateProduct = require("../usecases/product/updateProduct");
const countProducts = require("../usecases/product/getProductCount")
const getProductVisualates = require("../usecases/product/getProductVisualates");
const countProductVisualates = require("../usecases/product/countProductVisualates");
const searchProduct = require("../usecases/product/searchProduct");
const attachPic = require("../usecases/product/attachPic");
const detachPic = require("../usecases/product/detachPic");
const updateStatusToActive = require('../usecases/product/updateStatusToActive')

//

//Product type use cases
const addProductType = require("../usecases/product_type/addProductType");
const deleteProductType = require("../usecases/product_type/deleteProductType");
const getProductType = require("../usecases/product_type/getProductTypes");
const updateProductType = require("../usecases/product_type/updateProductTypes");
//Product category use cases
const addProductCategory = require("../usecases/product_category/addProductCategory");
const deleteProductCategory = require("../usecases/product_category/deleteProductCategory");
const getProductCategory = require("../usecases/product_category/getProductCategorys");
const updateProductCategory = require("../usecases/product_category/updateProductCategory");
//product division use cases
const addDivision = require("../usecases/division/addDivision")
const deleteDivision = require("../usecases/division/deleteDivision")
const getDivision = require("../usecases/division/getDivisions")
const updateDivision = require("../usecases/division/updateDivision")
//fav product use cases
const addFavProduct = require("../usecases/favouriteProduct/addFavouriteProduct");
const getFavProduct = require("../usecases/favouriteProduct/getFavouriteProduct");
const deleteFavProduct = require("../usecases/favouriteProduct/deleteFavouriteProduct");
const countFavProduct = require("../usecases/favouriteProduct/favProductCount");

//company order controller
const compantOrderCtrl = require("./company_order");
//order controller
const orderCtrl = require("./order")

//product divisions from franchisee
const getFranchiseeDivision = require("../usecases/franchisee/getFranchiseeDivisions")

//product search for web
const searchProductWeb = require("../usecases/product/searchProductWeb")
// formatter
const Formatter = require("../Formatters/index");

//import moment for date formatting
const moment = require("moment");

const moveFile = require('move-file');

const sortByCondition = require("../lib/sortByConditions");

const fs = require("fs");

const sizeOf = require('image-size');
const division = require("../models/division");

const IMG_SIZE = process.env.IMG_SIZE || 60000; //60KB
const VIS_SIZE = process.env.VIS_SIZE || 120000; //120KB

const IMG_HEIGHT = process.env.IMG_HEIGHT || 500; //500PX
const IMG_WIDTH = process.env.IMG_WIDTH || 500; //500PX

const VIS_HEIGHT = process.env.VIS_HEIGHT || 4000; //4000PX
const VIS_WIDTH = process.env.VIS_WIDTH || 1000; //1000PX

//Add product
exports.addProduct = async (productImages, product) => {
    let Images = [];
    let productVisualates = [];
    let productTechDetails = null;

    let imageUploadError = [];

    if (productImages) {
        if (productImages.images) {

            (productImages.images).forEach(it => {
                let img_dimensions = sizeOf(it.path);
                if (it.size > IMG_SIZE) imageUploadError.push(`${it.originalname} has Size more than ${parseInt(IMG_SIZE / 1024)}KB`);
                if (img_dimensions.height > IMG_HEIGHT || img_dimensions.width > IMG_WIDTH) {
                    imageUploadError.push(`${it.originalname} has Dimensions more than ${IMG_HEIGHT} * ${IMG_WIDTH}`);
                }
            })

            Images = productImages.images.map(it => {
                moveFile.sync(it.path, "./core/uploads/products/img/" + it.originalname)
                let path = "core/uploads/products/img/" + it.originalname
                return {
                    type: 'IMG',
                    url: path

                }
            })
        }

        if (productImages.visualate) {


            (productImages.visualate).forEach(it => {
                let img_dimensions = sizeOf(it.path);
                if (it.size > VIS_SIZE) imageUploadError.push(`${it.originalname} has Size more than ${parseInt(VIS_SIZE / 1024)}KB`);
                if (img_dimensions.height > VIS_HEIGHT || img_dimensions.width > VIS_WIDTH) {
                    imageUploadError.push(`${it.originalname} has Dimensions more than ${VIS_HEIGHT} * ${VIS_WIDTH}`);
                }
            })

            productVisualates = productImages.visualate.map(it => {
                moveFile.sync(it.path, "./core/uploads/products/vis/" + it.originalname)
                let path = "core/uploads/products/vis/" + it.originalname
                return {
                    type: 'VIS',
                    url: path
                }
            })
            Images = Images.concat(productVisualates)
        }
        if (productImages.doc) {
            productTechDetails = productImages.doc.map(it => {
                moveFile.sync(it.path, "./core/uploads/products/techDetails/" + it.originalname)
                let path = "core/uploads/products/techDetails/" + it.originalname
                return path
            })
            productTechDetails = productTechDetails[0];
        }
    }

    if (imageUploadError.length > 0) throw new Error(imageUploadError.toString())

    if (!product.division_id) throw new Error('product division Id is Required');
    if (!product.type_id) throw new Error('product type_id is Required');
    if (!product.category_id) throw new Error('product category_id is Required');
    if (!product.name) throw new Error('product Name is Required');
    if (!product.price) throw new Error('product price is Required');
    if (!product.description) throw new Error('product description is Required');
    if (!product.min_order_qty) product.min_order_qty = 1;


    let newproduct = {
        division_id: product.division_id,
        type_id: product.type_id,
        category_id: product.category_id,
        name: product.name,
        price: product.price,
        description: product.description,
        min_order_qty: product.min_order_qty,
        images: Images,
        packing_qty : product.packing_qty,
        technical_detail: productTechDetails,
        packing: product.packing ? product.packing : null,
        packing_type: product.packing_type ? product.packing_type : null,
        sku: product.sku ? product.sku : null,
        hsn_code: product.hsn_code ? product.hsn_code : null,
        new_launched: product.new_launched === true ||  product.new_launched === "true" ? true : false,
        upcoming : product.upcoming === true ||  product.upcoming === "true" ? true : false,

        details: product.details ? product.details : null,
        created_on: new Date(Date.now())
    }
    let savedproduct = await addProduct(newproduct);

    delete savedproduct.__v
    delete savedproduct.modified_on
    delete savedproduct.created_on
    //notification module
    if (process.env.NOTIFICATION_STATUS) {
        let sendNotification = require("../../firebase_notification")
        let message = product.name + " has been added in stock";
        let notificationResponse = await sendNotification({ title: "New Product Arrived", message: message }, "Distributor")
    }

    return savedproduct;
}

//Bulk Product list upload
exports.bulkUpload = async (productFile) => {
    let savedList = await bulkUpload(productFile);

    //notification module
    if (process.env.NOTIFICATION_STATUS) {
        let sendNotification = require("../../firebase_notification")
        let message = "Many new Products has been added in stock";
        let notificationResponse = await sendNotification({ title: "New Products Arrived", message: message }, "Distributor")
    }
    return savedList;
}
//bulk product images upload
exports.bulkImagesUpload = async (productImages, imagesType) => {
    let savedList = await bulkImagesUpload(productImages, imagesType);
    return savedList;
}
//bulk product images upload
exports.bulkDocsUpload = async (productTechnicalDocs) => {
    let savedList = await bulkDocsUplaod(productTechnicalDocs);
    return savedList;
}

//get product
exports.getProduct = async (productprops) => {
    let filter = {}
    filter.skip = 0;
    filter.limit = 1000;

    if (productprops.skip) filter.skip = productprops.skip;
    if (productprops.limit) filter.limit = productprops.limit;

    if (productprops.id) filter._id = productprops.id;

    if (productprops.name) filter.name = productprops.name;

    if (productprops.franchisee_id) {
        let divisions = await getFranchiseeDivision(productprops.franchisee_id)
        filter.division_id = divisions;
    }

    if (productprops.division_id) filter.division_id = productprops.division_id;

    if (productprops.type_id) filter.type_id = productprops.type_id;

    if (productprops.category_id) filter.category_id = productprops.category_id;

    if (productprops.new_launched) filter.new_launched = productprops.new_launched;

    if (productprops.upcoming) filter.upcoming = productprops.upcoming;

    if (productprops.sku) filter.sku = productprops.sku;
    if (productprops.hsn_code) filter.hsn_code = productprops.hsn_code;

    let productRecords = await getProduct(filter);

    if (productRecords.length == 1 && productprops.id) {
        if (productprops.search) return [Formatter.ProductFormatter(productRecords[0])]
        else
            return Formatter.ProductFormatter(productRecords[0])
    }
    else {
        productRecords = productRecords.map(it => {
            return Formatter.ProductFormatter(it)
        })
    }

    let sortOptions = [];

    if (!process.env.SORT_BY_NAME || process.env.SORT_BY_NAME == "true") sortOptions.push({ select: "name", order: "ascending" })
    if (process.env.SORT_BY_NAME == "false") sortOptions.push({ select: "name", order: "descending" })

    if (process.env.SORT_BY_TYPE == "true") sortOptions.push({ select: "type_name", order: "ascending" })
    if (process.env.SORT_BY_TYPE == "false") sortOptions.push({ select: "type_name", order: "descending" })

    if (process.env.SORT_BY_CATEGORY == "true") sortOptions.push({ select: "category_name", order: "ascending" })
    if (process.env.SORT_BY_CATEGORY == "false") sortOptions.push({ select: "category_name", order: "descending" })

    if (process.env.SORT_BY_CREATED_DATE == "true") sortOptions.push({ select: "created_on", order: "ascending" })
    if (process.env.SORT_BY_CREATED_DATE == "false") sortOptions.push({ select: "created_on", order: "descending" })


    //    productRecords = sortByCondition.sort(productRecords, sortOptions);
    return productRecords;
}


//get all product names
exports.getProductNames = async (productprops) => {
    let filter = {}
    if (productprops.franchisee_id) {
        let divisions = await getFranchiseeDivision(productprops.franchisee_id)
        filter.division_id = divisions;
    }
    if (productprops.division_id) filter.division_id = productprops.division_id;

    if (productprops.type_id) filter.type_id = productprops.type_id;

    if (productprops.category_id) filter.category_id = productprops.category_id;

    let productRecords = await getProductNames(filter);

    productRecords = productRecords.map(it => {
        return { id: it._id, name: it.name }
    })

    productRecords = sortByCondition.sort(productRecords, [{ select: "name", order: "ascending" }]);

    return productRecords;
}

//get new products
exports.getNewProduct = async (productprops) => {
    let filter = {}
    filter.new_launched = true;
    if (productprops.id) filter._id = productprops.id;

    if (productprops.name) filter.name = productprops.name;

    if (productprops.division_id) filter.division_id = productprops.division_id;
    if (productprops.franchisee_id) {
        let divisions = await getFranchiseeDivision(productprops.franchisee_id)
        filter.division_id = divisions;
    }
    if (productprops.type_id) filter.type_id = productprops.type_id;

    if (productprops.category_id) filter.category_id = productprops.category_id;
    let productRecords = await getProduct(filter);

    if (productRecords.length == 1 && productprops.id) return Formatter.ProductFormatter(productRecords[0])
    else {
        productRecords = productRecords.map(it => {
            return Formatter.ProductFormatter(it)
        })
    }
    productRecords = sortByCondition.sort(productRecords, [{ select: "name", order: "ascending" }, { select: "type_name", order: "ascending" }]);

    return productRecords;
}
//update product
exports.updateProduct = async (productImages, productprops) => {

    let productId = productprops.id;
    if (!productprops.id) throw new Error("Please provide product Id");
    let filter = {}
    let Images = [];
    let productVisualates = [];
    let productTechDetails = null;
    /////////////////////////
    if (productImages) {
        if (productImages.images) {
            let picsUploadError = [];

            (productImages.images).forEach(it => {
                let img_dimensions = sizeOf(it.path);
                if (it.size > IMG_SIZE) picsUploadError.push(`${it.originalname} has Size more than ${parseInt(IMG_SIZE / 1024)}KB`);
                if (img_dimensions.height > IMG_HEIGHT || img_dimensions.width > IMG_WIDTH) {
                    picsUploadError.push(`${it.originalname} has Dimensions more than ${IMG_HEIGHT} * ${IMG_WIDTH}`);
                }
            })

            if (picsUploadError.length > 0) throw new Error(picsUploadError.toString());

            Images = productImages.images.map(async it => {
                it.originalname = (it.originalname).replace(/(#)/, "")
                moveFile.sync(it.path, "./core/uploads/products/img/" + it.originalname)
                let path = "core/uploads/products/img/" + it.originalname

                await attachPic(productId, { type: 'IMG', url: path });
            })
        }
        if (productImages.visualate) {
            let picsUploadError = [];

            (productImages.visualate).forEach(it => {
                let img_dimensions = sizeOf(it.path);
                if (it.size > VIS_SIZE) picsUploadError.push(`${it.originalname} has Size more than ${parseInt(VIS_SIZE / 1024)}KB`);
                if (img_dimensions.height > VIS_HEIGHT || img_dimensions.width > VIS_WIDTH) {
                    picsUploadError.push(`${it.originalname} has Dimensions more than ${VIS_HEIGHT} * ${VIS_WIDTH}`);
                }
            })

            if (picsUploadError.length > 0) throw new Error(picsUploadError.toString());

            productVisualates = productImages.visualate.map(async it => {
                it.originalname = (it.originalname).replace(/(#)/, "")
                moveFile.sync(it.path, "./core/uploads/products/vis/" + it.originalname)
                let path = "core/uploads/products/vis/" + it.originalname

                await attachPic(productId, { type: 'VIS', url: path });
            })
        }
        if (productImages.doc) {
            productTechDetails = productImages.doc.map(it => {
                moveFile.sync(it.path, "./core/uploads/products/techDetails/" + it.originalname)
                let path = "core/uploads/products/techDetails/" + it.originalname
                return path
            })
            productTechDetails = productTechDetails[0];
        }
    }
    ////////////////////////

    if (productprops.name) filter.name = productprops.name;
    if (productprops.division_id) filter.division_id = productprops.division_id;
    if (productprops.type_id) filter.type_id = productprops.type_id;
    if (productprops.category_id) filter.category_id = productprops.category_id;
    if (productprops.price) filter.price = productprops.price;
    if (productprops.description) filter.description = productprops.description;
    if (productprops.min_order_qty) filter.min_order_qty = parseInt(productprops.min_order_qty);
    if (productprops.packing) filter.packing = productprops.packing;
    if (productprops.packing_type) filter.packing_type = productprops.packing_type;
    if (productprops.new_launched === true || productprops.new_launched === "true") filter.new_launched = true;
    if (productprops.new_launched === false || productprops.new_launched === "false" ) filter.new_launched = false;
    if (productprops.sku) filter.sku = productprops.sku;
    if (productprops.packing_qty) filter.packing_qty = productprops.packing_qty;
    if (productprops.hsn_code) filter.hsn_code = productprops.hsn_code;
    if (productprops.details) filter.details = productprops.details;
    if (productprops.upcoming === true || productprops.upcoming === "true") filter.upcoming = true;
    if (productprops.upcoming === false || productprops.upcoming === "false" ) filter.upcoming = false;
    if (productTechDetails != null) filter.technical_detail = productTechDetails;
    if (productprops.technical_detail) filter.technical_detail = productprops.technical_detail;

    filter.modified_on = new Date(Date.now());
    let productRecords = await updateProduct(productId, filter);

    if (productRecords.length == 1) return Formatter.ProductFormatter(productRecords[0])
    else {
        productRecords = productRecords.map(it => {
            return Formatter.ProductFormatter(it)
        })
    }
    return productRecords;

}

//delete product
exports.deleteProduct = async (productId) => {

    if (!productId) throw new Error("Please provide product Id");

    ///////////////////////////////////////////////////////////
//----------------------------------------------------------------------------------------------------------------------
//     let companyOrderTemp = await compantOrderCtrl.getOrder();
//     if(companyOrderTemp !== null) {
//         companyOrderTemp.forEach(it => {
//             it.orderlist.forEach(product => {
//                 if(product !== null) {
//                     if (product.product.id == productId)
//                         throw new Error("Unable to delete Product, Because it is used In some Company Order(s)!!!")
//                 }
//             })
//         })
//     }
//
//     let OrderTemp = await orderCtrl.getOrder({});
//     if (OrderTemp !== null ) {
//         OrderTemp.forEach(it => {
//             it.orderlist.forEach(product => {
//                 if(product !== null) {
//                     if (product.product.id == productId)
//                         throw new Error("Unable to delete Product, Because it is used In some Order(s)!!!")
//                 }
//             })
//         })
//     }
//
//
//     let favProductTemp = await exports.getFavProduct({})
//
//     favProductTemp.forEach(it => {
//         if (it.id == productId)
//             throw new Error("Unable to delete Product, because it is used as Favourite Product!!!")
//     })
    ///////////////////////////////////////////////////////////

    let productResponse = await deleteProduct(productId);
    return productResponse;
}
//count products according to condition
exports.countProducts = async (productprops) => {
    let filter = {}

    if (productprops.new_launched) filter.new_launched = productprops.new_launched;

    if (productprops.franchisee_id) {
        let divisions = await getFranchiseeDivision(productprops.franchisee_id)
        filter.division_id = divisions;
    }

    if (productprops.division_id) filter.division_id = productprops.division_id;

    if (productprops.type_id) filter.type_id = productprops.type_id;

    if (productprops.category_id) filter.category_id = productprops.category_id;

    let productRecords = await countProducts(filter);

    return { count: productRecords };
}
//get visualates of products
exports.getVisualates = async (productprops) => {
    let filter = {}
    if (productprops.franchisee_id) {
        let divisions = await getFranchiseeDivision(productprops.franchisee_id)
        filter.division_id = divisions;
    }
    if (productprops.division_id) filter.division_id = productprops.division_id;
    if (productprops.category_id) filter.category_id = productprops.category_id;
    if (productprops.product_id) filter._id = productprops.product_id;
    if (productprops.type_id) filter.type_id = productprops.type_id;

    let productRecords = await getProductVisualates(filter);
    let visualaids = [];
    if (productRecords.length == 0)
        return visualaids;
    productRecords.forEach(it => {
        if (fs.existsSync(it.url))
            visualaids.push({
                url: `${process.env.BASE_URL}/${it.url}`
            })
    });

    var resArr = [];
    visualaids.filter(function (item) {
        var i = resArr.findIndex(x => (x.url == item.url));
        if (i <= -1) {
            resArr.push(item);
        }
        return null;
    });
    return resArr;
}
//count visualates of products
exports.countVisualates = async (productprops) => {
    let filter = {}

    if (productprops.franchisee_id) {
        let divisions = await getFranchiseeDivision(productprops.franchisee_id)
        filter.division_id = divisions;
    }
    if (productprops.division_id) filter.division_id = productprops.division_id;


    let productRecords = await getProductVisualates(filter);
    let visualaids = [];

    if (productRecords.length == 0)
        return visualaids;
    productRecords.forEach(it => {
        if (fs.existsSync(it.url))
            visualaids.push({
                url: `${process.env.BASE_URL}${it.url}`
            })
    });

    var resArr = [];

    visualaids.filter(function (item) {
        var i = resArr.findIndex(x => (x.url == item.url));
        if (i <= -1) {
            resArr.push(item);
        }
        return null;
    });
    return {
        count: resArr.length
    };
}
// Product Search
exports.searchProduct = async (productFilter) => {
    let filter = {}
    if (productFilter.filter) filter.data = productFilter.filter;
    if (productFilter.franchisee_id) {
        let divisions = await getFranchiseeDivision(productFilter.franchisee_id)
        filter.division_id = divisions;
    }
    if (productFilter.new_launched) filter.data = productFilter
    if (productFilter.upcoming) filter.data = productFilter
    let productRecords = await searchProduct(filter);

    productRecords = productRecords.map(it => {
        return Formatter.ProductFormatter(it)
    })
    productRecords = sortByCondition.sort(productRecords, [{ select: "name", order: "ascending" }, { select: "type_name", order: "ascending" }]);

    return productRecords;
}
// Product Search for web
exports.searchProductWeb = async (productFilter) => {
    let filter = {}
    if (productFilter) filter.data = productFilter;

    let productRecords = await searchProductWeb(filter);
    console.log(filter, productRecords.length)
    productRecords = productRecords.map(it => {
        return Formatter.ProductFormatter(it)
    })
    productRecords = sortByCondition.sort(productRecords, [{ select: "name", order: "ascending" }, { select: "type_name", order: "ascending" }]);

    return productRecords;
}
//attact image to product
exports.attachPic = async (productprops) => {
    if (!productprops.id) throw new Error("Please provide product Id");
    if (!productprops.url) throw new Error("Please provide product image url");
    if (!productprops.type) throw new Error("Please provide product image type");


    let productId = productprops.id;
    let filter = {}
    if (productprops.url) filter.url = productprops.url;
    if (productprops.type) filter.type = productprops.type;
    // filter.modified_on = new Date(Date.now());
    let productRecords = await attachPic(productId, filter);

    return productRecords;
}
//detach image from product
exports.detachPic = async (productprops) => {

    if (!productprops.id) throw new Error("Please provide product Id");
    if (!productprops.url) throw new Error("Please provide product image url");
    if (!productprops.type) throw new Error("Please provide product image type");

    let productId = productprops.id;
    let filter = {}
    productprops.url = (productprops.url).replace(process.env.BASE_URL + "/", "")
    if (productprops.url) filter.url = productprops.url;
    if (productprops.type) filter.type = productprops.type;
    // filter.modified_on = new Date(Date.now());

    let productRecords = await detachPic(productId, filter);

    return productRecords;
}

/*****************Product type controller functions *******************/

//Add product Type
exports.addProductType = async (productType) => {

    if (!productType.name) throw new Error('product Type Name is Required');
    if (!productType.active) productType.active = true;
    let newproductType = {
        name: productType.name,
        active: productType.active
    }
    let savedproductType = await addProductType(newproductType);
    delete savedproductType.__v

    return savedproductType;
}
//update product Type
exports.updateProductType = async (productTypeProps) => {
    let productTypeId = productTypeProps.id;
    if (!productTypeProps.id) throw new Error("Please provide product Type Id");
    let filter = {}
    if (productTypeProps.name) filter.name = productTypeProps.name;
    if (productTypeProps.active == true || productTypeProps.active == false) filter.active = productTypeProps.active;

    let productTypeRecords = await updateProductType(productTypeId, filter);
    productTypeRecords = productTypeRecords.map(it => {
        return {
            id: it._id,
            name: it.name,
            active: it.active,
        }
    })
    return productTypeRecords;
}
//get product Type
exports.getProductType = async (productTypeProps) => {
    let filter = {}
    if (productTypeProps.id) filter._id = productTypeProps.id;

    if (productTypeProps.name) filter.name = productTypeProps.name;

    let productTypeRecords = await getProductType(filter);

    productTypeRecords = productTypeRecords.map(it => {

        return {
            id: it._id,
            name: it.name,
            active: it.active
        }
    })
    return productTypeRecords;
}
//delete product Type
exports.deleteProductType = async (productTypeId) => {
    if (!productTypeId) throw new Error("Please provide product Type Id");
    let allProducts = await exports.getProduct({});
    let flag = 0
    allProducts.forEach(it => {
        if (it.type_id == productTypeId) flag++;

    })
    if (flag > 0) throw new Error("Unable to Delete Product Type because it is linked with some product!!!")
    else {
        let productTypeResponse = await deleteProductType(productTypeId);
        return productTypeResponse;
    }
}

/************Product category controller functions *******************/

//Add product Category
exports.addProductCategory = async (productCat) => {

    if (!productCat.name) throw new Error('product Category Name is Required');
    if (!productCat.active) productCat.active = true;
    let newproductCat = {
        name: productCat.name,
        active: productCat.active
    }
    let savedproductCat = await addProductCategory(newproductCat);
    delete savedproductCat.__v

    return savedproductCat;
}
//update product Category
exports.updateProductCategory = async (productCatProps) => {
    let filter = {}
    let productCatId = productCatProps.id;
    if (!productCatProps.id) throw new Error("Please provide product Category Id");
    if (!productCatProps.name) throw new Error("Please provide product Category Name that you want to change");
    if (productCatProps.active == true || productCatProps.active == false) filter.active = productCatProps.active;

    filter.name = productCatProps.name;
    let productCatRecords = await updateProductCategory(productCatId, filter);
    productCatRecords = productCatRecords.map(it => {
        return {
            id: it._id,
            name: it.name,
            active: it.active,
        }
    })
    return productCatRecords;
}
//get product Category
exports.getProductCategory = async (productCatProps) => {
    let filter = {}
    if (productCatProps.id) filter._id = productCatProps.id;

    if (productCatProps.name) filter.name = productCatProps.name;

    let productCatRecords = await getProductCategory(filter);

    productCatRecords = productCatRecords.map(it => {

        return {
            id: it._id,
            name: it.name,
            active: it.active
        }
    })
    return productCatRecords;
}
//delete product Category
exports.deleteProductCategory = async (productCatId) => {
    if (!productCatId) throw new Error("Please provide product Category Id");
    let allProducts = await exports.getProduct({});
    let flag = 0
    allProducts.forEach(it => {
        if (it.category_id == productCatId) flag++;

    })
    if (flag > 0) throw new Error("Unable to Delete Product Category because it is linked with some product!!!")
    else {
        let productCatResponse = await deleteProductCategory(productCatId);
        return productCatResponse;
    }
}

/********************Product Division controller Functions *******************/
//Add division
exports.addDivision = async (division) => {

    if (!division.name) throw new Error('Division Name is Required');

    if (!division.address) division.address = "NA";

    if (!division.email) division.email = "NA";

    if (!division.phone) division.phone = "NA";

    let newdivision = {
        name: division.name,
        address: division.address,
        email: division.email,
        phone: division.phone,
        created_on: new Date(Date.now())
    }
    let saveddivision = await addDivision(newdivision);

    delete saveddivision.__v
    delete saveddivision.modified_on
    delete saveddivision.created_on
    delete saveddivision.active

    return saveddivision;
}

//get division
exports.getDivision = async (divisionprops) => {
    let filter = {}
    if (divisionprops.franchisee_id) {
        let divisions = await getFranchiseeDivision(divisionprops.franchisee_id)
        filter._id = divisions;
    }

    if (divisionprops.id) filter._id = divisionprops.id;

    if (divisionprops.name) filter.name = divisionprops.name;

    if (divisionprops.email) filter.email = divisionprops.email;

    if (divisionprops.phone) filter.phone = divisionprops.phone;

    if (divisionprops.active) filter.active = divisionprops.active;
    let DivisionRecords = await getDivision(filter);

    if (DivisionRecords.length == 1 && divisionprops.id) return Formatter.DivisionFormatter(DivisionRecords[0])
    else {
        DivisionRecords = DivisionRecords.map(it => {
            return Formatter.DivisionFormatter(it)
        })
    }
    return DivisionRecords;
}

//update division
exports.updateDivision = async (divisionprops) => {
    let divisionId = divisionprops.id;
    if (!divisionprops.id) throw new Error("Please provide Division Id");
    let filter = {}
    if (divisionprops.name) filter.name = divisionprops.name;
    if (divisionprops.address) filter.address = divisionprops.address;
    if (divisionprops.email) filter.email = divisionprops.email;
    if (divisionprops.phone) filter.phone = divisionprops.phone;
    if (divisionprops.active) filter.active = divisionprops.active;
    filter.modified_on = new Date(Date.now());
    let DivisionRecords = await updateDivision(divisionId, filter);
    if (DivisionRecords.length == 1 && divisionprops.id) return Formatter.DivisionFormatter(DivisionRecords[0])
    else {
        DivisionRecords = DivisionRecords.map(it => {
            return Formatter.DivisionFormatter(it)
        })
    }
    return DivisionRecords;
}
//delete division
exports.deleteDivision = async (divisionId) => {
    if (!divisionId) throw new Error("Please provide Division Id");

    let DivisionResponse = await deleteDivision(divisionId);
    return DivisionResponse;
}

/************************Favourite Product controller Functions ************************************** */

exports.addFavProduct = async (favProduct) => {

    if (!favProduct.products) throw new Error('products(Ids) are Required');

    let savedFavProduct = await addFavProduct(favProduct);

    return savedFavProduct;
}

exports.getFavProduct = async (productprops) => {


    let favProductRecords = await getFavProduct(productprops);


    if (favProductRecords === null) return [];

    else {
        let products = favProductRecords.products;
        favProductRecords = products.map(it => {
            return Formatter.ProductFormatter(it)
        })
    }
    return favProductRecords;
}

exports.deleteFavProduct = async (productprops) => {

    if (!productprops.products) throw new Error("Please provide Product Id(s)");

    let favProResponse = await deleteFavProduct(productprops);

    return favProResponse;
}

exports.countFavProduct = async (productprops) => {

    let productRecords = await countFavProduct(productprops);

    return productRecords;
}

exports.updateStatusToActive = async (productProps) => {
    let response = await updateStatusToActive(productProps)
    return response;
}