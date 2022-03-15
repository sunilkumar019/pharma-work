const router = require('express').Router()
const offerHandler = require('../handlers/offer')
const checkAuth = require("../../../core/middleware/check-auth")

router.get('/get', checkAuth, offerHandler.getOffer)

router.get("/count", checkAuth, offerHandler.countOffer);

module.exports = router