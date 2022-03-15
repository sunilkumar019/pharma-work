const router = require('express').Router()
const productHandler = require('../handlers/product')
const checkAuth = require("../../../core/middleware/check-auth")

/////////////unprotected API/////////////////////////////

router.post('/up/names', productHandler.getProductNames);

router.post('/up/get', productHandler.getProduct);

router.post("/up/new/get", productHandler.getNewProduct);

router.post('/up/count', productHandler.countProducts);

router.post('/up/new/count', productHandler.countNewProducts);

router.post('/up/visualates', productHandler.getVisualates)

router.post('/up/visualates/count', productHandler.countVisualates)
/*****************Product Search******************** */
router.post('/up/search', productHandler.productSearch);

/************product type routes ***************/
router.post("/up/type/get", productHandler.getProductType);

/************product category routes ***************/
router.post("/up/category/get", productHandler.getProductCategory)

/************product division routes ***************/
router.post("/up/division/get", productHandler.getProductDivisions);

/////////////unprotected API/////////////////////////////


router.post('/names', checkAuth, productHandler.getProductNames);
router.post('/get', checkAuth, productHandler.getProduct);

router.post("/new/get", checkAuth, productHandler.getNewProduct);

router.post('/count', checkAuth, productHandler.countProducts);

router.post('/new/count', checkAuth, productHandler.countNewProducts);

router.post('/visualates', checkAuth, productHandler.getVisualates)

router.post('/visualates/count', checkAuth, productHandler.countVisualates)

/*****************Product Search******************** */
router.post('/search',checkAuth,productHandler.productSearch);

/************product type routes ***************/
router.post("/type/get", checkAuth, productHandler.getProductType);

/************product category routes ***************/
router.post("/category/get", checkAuth, productHandler.getProductCategory)

/************product division routes ***************/
router.post("/division/get", checkAuth, productHandler.getProductDivisions);

/************packing types routes ***************/
router.post("/packingType/get", productHandler.getPackingTypes)

/************ favourite product routes ***************/
router.post("/fav/add", checkAuth, productHandler.addFavProduct);

router.get("/fav/get", checkAuth, productHandler.getFavProduct);

router.post("/fav/delete", checkAuth, productHandler.deleteFavProduct);

router.get("/fav/count", checkAuth, productHandler.countFavProduct);

module.exports = router