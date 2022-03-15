const router = require('express').Router()
const customerHandler = require('../handlers/customer')
const check_auth = require("../../../core/middleware/check-auth-admin");

router.post('/get', check_auth, customerHandler.getCustomer)

router.get('/count', check_auth, customerHandler.countCustomer)

router.post('/search', check_auth, customerHandler.searchCustomer)


module.exports = router