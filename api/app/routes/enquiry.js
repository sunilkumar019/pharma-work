const router = require('express').Router()
const enquiryHandler = require('../handlers/enquiry')

router.put('/', enquiryHandler.addEnquiry)

module.exports = router