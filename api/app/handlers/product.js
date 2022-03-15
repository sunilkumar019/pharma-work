const productController = require("../../../core/controllers/product");
const packingTypeController = require("../../../core/controllers/packing_type")
/*************Product handlers *****************/
const getProduct = async (req, res, next) => {
    if (req.franchiseeId) req.body.franchisee_id = req.franchiseeId;
    try {
        let products = await productController.getProduct(req.body);


        let favProducts = [];

        let productsResponse = [];

        if (Array.isArray(products)) {
            if (req.repId) favProducts = await productController.getFavProduct({ rep_id: req.repId });
            for (let i = 0; i < products.length; i++) {
                let product = products[i];
                let dataToPush = null;
                if (favProducts.length > 0) {
                    let flag = 0;
                    for (let j = 0; j < favProducts.length; j++) {
                        let favPro = favProducts[j];
                        if ((product.id).toString() == (favPro.id).toString()) {
                            dataToPush = { ...product, favourite: true };
                            flag = 1;
                            break;
                        }
                    }
                    if (flag == 0) dataToPush = { ...product, favourite: false };

                }
                else dataToPush = { ...product, favourite: false }

                if (process.env.REMOVE_DUPLICATE_PRODUCTS) {
                    if (process.env.REMOVE_DUPLICATE_PRODUCTS == 'true') {
                        let isDuplicateName = false;
                        productsResponse.forEach(it => { if (it.name == dataToPush.name) isDuplicateName = true });

                        if (!isDuplicateName) productsResponse.push(dataToPush);
                    }
                    else productsResponse.push(dataToPush);
                }
                else productsResponse.push(dataToPush);
            }
        }
        else {
            productsResponse = {
                ...products,
                favourite: false
            }
        }
        req.data = productsResponse;
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const getProductNames = async (req, res, next) => {
    if (req.franchiseeId) req.body.franchisee_id = req.franchiseeId;
    try {
        let product = await productController.getProductNames(req.body);
        req.data = product;
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const getNewProduct = async (req, res, next) => {
    if (req.franchiseeId) req.body.franchisee_id = req.franchiseeId
    try {
        let products = await productController.getNewProduct(req.body);
        let favProducts = [];

        let productsResponse = [];

        if (Array.isArray(products)) {
            if (req.repId) favProducts = await productController.getFavProduct({ rep_id: req.repId });

            for (let i = 0; i < products.length; i++) {
                let product = products[i];
                let dataToPush = null;
                if (favProducts.length > 0) {
                    let flag = 0;
                    for (let j = 0; j < favProducts.length; j++) {
                        let favPro = favProducts[j];
                        if ((product.id).toString() == (favPro.id).toString()) {
                            dataToPush = { ...product, favourite: true };
                            flag = 1;
                            break;
                        }
                    }

                    if (flag == 0) dataToPush = { ...product, favourite: false };

                }
                else dataToPush = { ...product, favourite: null }

                if (process.env.REMOVE_DUPLICATE_PRODUCTS) {
                    if (process.env.REMOVE_DUPLICATE_PRODUCTS == 'true') {
                        let isDuplicateName = false;
                        productsResponse.forEach(it => { if (it.name == dataToPush.name) isDuplicateName = true });

                        if (!isDuplicateName) productsResponse.push(dataToPush);
                    }
                    else productsResponse.push(dataToPush);
                }
                else productsResponse.push(dataToPush);
            }
        }
        else {
            productsResponse = {
                ...products,
                favourite: null
            }
        }


        req.data = productsResponse;
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}
const countProducts = async (req, res, next) => {
    if (req.franchiseeId) req.body.franchisee_id = req.franchiseeId
    try {
        let productRecords = await productController.countProducts(req.body)
        req.data = productRecords
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}
const countNewProducts = async (req, res, next) => {
    if (req.franchiseeId) req.body.franchisee_id = req.franchiseeId
    req.body.new_launched = true;
    try {
        let productRecords = await productController.countProducts(req.body)
        req.data = productRecords
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}
const getVisualates = async (req, res, next) => {
    if (req.franchiseeId) req.body.franchisee_id = req.franchiseeId
    try {
        let productVis = await productController.getVisualates(req.body)
        req.data = productVis
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}
const countVisualates = async (req, res, next) => {
    if (req.franchiseeId) req.body.franchisee_id = req.franchiseeId
    try {
        let productVis = await productController.countVisualates(req.body)
        req.data = productVis
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}
const productSearch = async (req, res, next) => {
    if (req.franchiseeId) req.body.franchisee_id = req.franchiseeId
    try {
        let products = await productController.searchProduct(req.body);
        let favProducts = [];

        let productsResponse = [];

        if (Array.isArray(products)) {
            if (req.repId) favProducts = await productController.getFavProduct({ rep_id: req.repId });

            for (let i = 0; i < products.length; i++) {
                let product = products[i];
                let dataToPush = null;
                if (favProducts.length > 0) {
                    let flag = 0;
                    for (let j = 0; j < favProducts.length; j++) {
                        let favPro = favProducts[j];
                        if ((product.id).toString() == (favPro.id).toString()) {
                            dataToPush = { ...product, favourite: true };
                            flag = 1;
                            break;
                        }
                    }

                    if (flag == 0) dataToPush = { ...product, favourite: false };

                }
                else dataToPush = { ...product, favourite: null }

                if (process.env.REMOVE_DUPLICATE_PRODUCTS) {
                    if (process.env.REMOVE_DUPLICATE_PRODUCTS == 'true') {
                        let isDuplicateName = false;
                        productsResponse.forEach(it => { if (it.name == dataToPush.name) isDuplicateName = true });

                        if (!isDuplicateName) productsResponse.push(dataToPush);
                    }
                    else productsResponse.push(dataToPush);
                }
                else productsResponse.push(dataToPush);
            }
        }
        else {
            productsResponse = {
                ...products,
                favourite: null
            }
        }


        req.data = productsResponse;

        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

/*************Product type handlers *****************/
const getProductType = async (req, res, next) => {
    try {
        let productType = await productController.getProductType(req.body)
        req.data = productType
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}
/*************Product category handlers *****************/
const getProductCategory = async (req, res, next) => {
    try {
        let productCat = await productController.getProductCategory(req.body)
        req.data = productCat
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

/*************Packing types handlers *****************/
const getPackingTypes = async (req, res, next) => {
    try {
        let packingTypes = await packingTypeController.get(req.body)
        req.data = packingTypes
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

/*************Product divisions handlers *****************/
const getProductDivisions = async (req, res, next) => {
    if (req.franchiseeId) req.body.franchisee_id = req.franchiseeId
    try {
        let productDiv = await productController.getDivision(req.body)
        if (!Array.isArray(productDiv)) productDiv = [productDiv]
        req.data = productDiv
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

/*******************Favourite Product handlers*************************/
const addFavProduct = async (req, res, next) => {
    req.body.rep_id = req.repId;
    try {
        let favProduct = await productController.addFavProduct(req.body)
        req.data = null;
        if (favProduct.message) {
            req.message = favProduct.message;
            return next()
        }
        next(new Error("Something went wrong"));
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const getFavProduct = async (req, res, next) => {
    try {
        let favProduct = await productController.getFavProduct({ rep_id: req.repId })

        let productsResponse = [];

        if (Array.isArray(favProduct)) {

            for (let i = 0; i < favProduct.length; i++) {

                productsResponse.push({ ...favProduct[i], favourite: true });

            }
        }
        else {
            productsResponse = {
                ...favProduct,
                favourite: true
            }
        }


        req.data = productsResponse;


        next();
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const deleteFavProduct = async (req, res, next) => {
    req.body.rep_id = req.repId;
    try {
        let favProduct = await productController.deleteFavProduct(req.body)
        req.data = null;

        if (favProduct.Message) {
            req.message = favProduct.Message;
            return next()
        }

        next(new Error("Something went wrong"));
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const countFavProduct = async (req, res, next) => {
    try {
        let favProductCount = await productController.countFavProduct({ rep_id: req.repId })
        req.data = favProductCount
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

module.exports = {
    getProduct, getProductNames, getNewProduct, countProducts, countNewProducts, getVisualates, countVisualates,
    productSearch,
    getProductType,
    getProductCategory,
    getPackingTypes,
    getProductDivisions,
    addFavProduct, getFavProduct, deleteFavProduct, countFavProduct
}