const router = require('express').Router()
const offerHandler = require('../handlers/offer')
let multer = require('multer');
const check_auth = require("../../../core/middleware/check-auth-admin");

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './core/uploads/offers')
    },
    filename: function (req, file, cb) {
        cb(null, (file.originalname).replace(/ /g, '_').toLowerCase())
    }
})

let upload = multer({ storage: storage })

router.post('/add', check_auth, upload.fields([{ name: 'image', maxCount: 10 }]), offerHandler.addOffer)

router.post('/get', check_auth, offerHandler.getOffer)

router.get('/count', check_auth, offerHandler.countOffer);

router.post('/update', check_auth, upload.fields([{ name: 'image', maxCount: 10 }]), offerHandler.updateOffer)

router.get('/delete/:Id', check_auth, offerHandler.deleteOffer)

module.exports = router