const router = require('express').Router()
const orderHandler = require('../handlers/company_order')
const checkAuth = require("../../../core/middleware/check-auth")

router.post('/add', checkAuth, orderHandler.addOrder)

router.post('/get', checkAuth,orderHandler.getOrder)

router.post('/count', checkAuth,orderHandler.countOrder)

module.exports = router