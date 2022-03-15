const router = require('express').Router()
const customerHandler = require('../handlers/customer')
const checkAuth = require("../../../core/middleware/check-auth")
let multer = require('multer');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './core/uploads/temp')
    },
    filename: function (req, file, cb) {
      cb(null,(file.originalname).replace(/ /g,'_').toLowerCase())
    }
  })
  
let upload = multer({ storage: storage })

router.post('/add',checkAuth, customerHandler.addCustomer)

router.post('/bulkUpload',checkAuth,upload.single("customers"),customerHandler.bulkUpload)

router.post('/get', checkAuth,customerHandler.getCustomer)

router.post('/update', checkAuth,customerHandler.updateCustomer)

router.get('/delete/:Id', checkAuth,customerHandler.deleteCustomer)

module.exports = router