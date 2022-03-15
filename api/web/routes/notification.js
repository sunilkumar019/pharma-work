const router = require('express').Router()
const notification = require('../handlers/notification.js')
const check_auth = require("../../../core/middleware/check-auth-admin");

router.post('/', check_auth, notification)

module.exports = router