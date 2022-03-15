const productController = require("../../../core/controllers/product");
const packingTypeController = require("../../../core/controllers/packing_type");

/*************Product handlers *****************/
const addProduct = async (req, res, next) => {

    try {
        let product = await productController.addProduct(req.files, req.body)
        req.data = product
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}
const bulkListUpload = async (req, res, next) => {
    try {
        // result = await convertcsvtojson('./uploads/ProductImages/' + req.file.filename);
        let productList = await productController.bulkUpload(req.file.filename)
        req.data = productList
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }



}
const bulkImagesUpload = async (req, res, next) => {
    try {
        let productList = await productController.bulkImagesUpload(req.files, req.body.type)
        req.data = productList
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const bulkDocsUpload = async (req, res, next) => {
    try {
        if (!req.files.docs) throw new Error("Please upload Technical Detail documents!!")
        let productDocs = await productController.bulkDocsUpload(req.files.docs)
        req.data = productDocs
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}

const getProduct = async (req, res, next) => {
    try {
        let product = await productController.getProduct(req.body)
        req.data = product
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}
const updateProduct = async (req, res, next) => {
    try {
        let productRecords = await productController.updateProduct(req.files, req.body)
        req.data = productRecords
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}
const deleteProduct = async (req, res, next) => {
    try {
        let productRes = await productController.deleteProduct(req.params.Id)
        if (productRes.Error) {
            req.status = 400;
            next(productRes.Error)
        } else {
            req.message = productRes.Message;
            req.data = null;
            next()
        }
    } catch (e) {
        req.status = 400;
        next(e)
    }
}
const countProducts = async (req, res, next) => {
    try {
        let productRecords = await productController.countProducts(req.body)
        req.data = productRecords
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}
const productSearch = async (req, res, next) => {
    try {
        let product = await productController.searchProductWeb(req.body)
        req.data = product
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}
const attachPic = async (req, res, next) => {
    try {
        let productRecords = await productController.attachPic(req.body)
        req.data = productRecords
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}
const detachPic = async (req, res, next) => {
    try {
        let productRecords = await productController.detachPic(req.body)
        req.data = productRecords
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}


/*************Product type handlers *****************/
const addProductType = async (req, res, next) => {

    try {
        let productType = await productController.addProductType(req.body)
        req.data = productType
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}
const getProductType = async (req, res, next) => {
    try {
        let productType = await productController.getProductType(req.body)
        req.data = productType
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}
const updateProductType = async (req, res, next) => {
    try {
        let productTypeRecords = await productController.updateProductType(req.body)
        req.data = productTypeRecords
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}
const deleteProductType = async (req, res, next) => {
    try {
        let productTypeRes = await productController.deleteProductType(req.params.Id)
        if (productTypeRes.Error) {
            throw new Error(productTypeRes.Error)
        } else {
            req.message = productTypeRes.Message;
            req.data = null;
            next()
        }
    } catch (e) {
        console.log(e)
        req.status = 400;
        next(e)
    }
}

/*************Product category handlers *****************/
const addProductCategory = async (req, res, next) => {

    try {
        let productCat = await productController.addProductCategory(req.body)
        req.data = productCat
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}
const getProductCategory = async (req, res, next) => {
    try {
        let productCat = await productController.getProductCategory(req.body)
        req.data = productCat
        next()
    } catch (e) {
        console.log(e)
        req.status = 400;
        next(e)
    }
}
const updateProductCategory = async (req, res, next) => {
    try {
        let productCatRecords = await productController.updateProductCategory(req.body)
        req.data = productCatRecords
        next()
    } catch (e) {
        console.log(e)
        req.status = 400;
        next(e)
    }
}
const deleteProductCategory = async (req, res, next) => {
    try {
        let productCatRes = await productController.deleteProductCategory(req.params.Id)
        if (productCatRes.Error) {
            throw new Error(productCatRes.Error)
        } else {
            req.message = productCatRes.Message;
            req.data = null;
            next()
        }
    } catch (e) {
        console.log(e)
        req.status = 400;
        next(e)
    }
}


/*************Packing type handlers *****************/
const addPackingType = async (req, res, next) => {

    try {
        let packingType = await packingTypeController.add(req.body)
        req.data = packingType
        next()
    } catch (e) {
        req.status = 400;
        next(e)
    }
}
const getPackingType = async (req, res, next) => {
    try {
        let packingType = await packingTypeController.get(req.body)
        req.data = packingType
        next()
    } catch (e) {
        console.log(e)
        req.status = 400;
        next(e)
    }
}
const updatePackingType = async (req, res, next) => {
    try {
        let packingTypeRecords = await packingTypeController.update(req.body)
        req.data = packingTypeRecords
        next()
    } catch (e) {
        console.log(e)
        req.status = 400;
        next(e)
    }
}
const deletePackingType = async (req, res, next) => {
    try {
        let packingTypeRes = await packingTypeController.delete(req.params.Id)
        if (packingTypeRes.Error) {
            throw new Error(packingTypeRes.Error)
        } else {
            req.message = packingTypeRes.Message;
            req.data = null;
            next()
        }
    } catch (e) {
        console.log(e)
        req.status = 400;
        next(e)
    }
}

const updateStatusToActive = async (req, res) => {
    const data = req.body;
    const response = await productController.updateStatusToActive(data)
    res.send({response});
}



module.exports = {
    addProduct,
    bulkListUpload,
    bulkImagesUpload,
    bulkDocsUpload,
    getProduct,
    updateProduct,
    deleteProduct,
    countProducts,
    productSearch,
    attachPic,
    detachPic,
    addProductType,
    getProductType,
    updateProductType,
    deleteProductType,
    addProductCategory,
    getProductCategory,
    updateProductCategory,
    deleteProductCategory,
    addPackingType,
    getPackingType,
    updatePackingType,
    deletePackingType,
    updateStatusToActive
}