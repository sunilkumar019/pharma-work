const router = require('express').Router()
const orderHandler = require('../handlers/order')
const checkAuth = require("../../../core/middleware/check-auth")

router.post('/add', checkAuth, orderHandler.addOrder)

router.post('/get', checkAuth, orderHandler.getOrder)

router.post('/count', checkAuth, orderHandler.countOrder)

//router.post('/update',orderHandler.updateOrder)  //not done

//router.get('/delete/:Id',orderHandler.deleteOrder) //not done

module.exports = router