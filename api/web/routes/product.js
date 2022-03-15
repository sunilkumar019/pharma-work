const router = require('express').Router()
const productHandler = require('../handlers/product');
let multer = require('multer');
const check_auth = require("../../../core/middleware/check-auth-admin");


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './core/uploads/temp')
    },
    filename: function (req, file, cb) {
        cb(null, (file.originalname).replace(/ /g, '_').toLowerCase())
    }
})

let upload = multer({ storage: storage })

router.post('/add', check_auth, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'visualate', maxCount: 10 }, { name: 'doc', maxCount: 1 }]), productHandler.addProduct);

router.post('/bulkListUpload', check_auth, upload.single("productsfile"), productHandler.bulkListUpload);

router.post('/bulkImagesUpload', check_auth, upload.fields([{ name: 'images', maxCount: 900 }]), productHandler.bulkImagesUpload)

router.post('/bulkDocsUpload', check_auth, upload.fields([{ name: 'docs', maxCount: 900 }]), productHandler.bulkDocsUpload)

router.post('/get', check_auth, productHandler.getProduct)

router.post("/update/activeStatus", check_auth, productHandler.updateStatusToActive)

router.post('/update', check_auth, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'visualate', maxCount: 10 }, { name: 'doc', maxCount: 1 }]), productHandler.updateProduct)

router.get('/delete/:Id', check_auth, productHandler.deleteProduct)

router.post('/count', check_auth, productHandler.countProducts);

router.post('/attachPic', check_auth, productHandler.attachPic);

router.post('/detachPic', check_auth, productHandler.detachPic);

/*****************Product Search******************** */

router.post('/search', check_auth, productHandler.productSearch);

/************product type routes ***************/

router.post("/type/add", check_auth, productHandler.addProductType);
router.post("/type/get", check_auth, productHandler.getProductType);
router.post("/type/update", check_auth, productHandler.updateProductType);
router.get("/type/delete/:Id", check_auth, productHandler.deleteProductType);

/************product category routes ***************/
router.post("/category/add", check_auth, productHandler.addProductCategory);
router.post("/category/get", check_auth, productHandler.getProductCategory);
router.post("/category/update", check_auth, productHandler.updateProductCategory);
router.get("/category/delete/:Id", check_auth, productHandler.deleteProductCategory);

/************packing type routes ***************/

router.post("/packingType/add", check_auth, productHandler.addPackingType);
router.post("/packingType/get", check_auth, productHandler.getPackingType);
router.post("/packingType/update", check_auth, productHandler.updatePackingType);
router.get("/packingType/delete/:Id", check_auth, productHandler.deletePackingType);


module.exports = router