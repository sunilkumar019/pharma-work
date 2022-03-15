const router = require('express').Router()
const enquiryHandler = require('../handlers/enquiry')
const check_auth = require("../../../core/middleware/check-auth-admin");

router.post('/get', check_auth, enquiryHandler.getEnquiry)

router.post('/count', check_auth, enquiryHandler.countEnquiry)

router.delete('/:Id', check_auth, enquiryHandler.deleteEnquiry)

router.post('/search', check_auth, enquiryHandler.searchEnquiry);


module.exports = router