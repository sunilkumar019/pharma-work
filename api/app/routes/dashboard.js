const router = require('express').Router()
const dashboardHandler = require('../handlers/dashboard')
const checkAuth = require("../../../core/middleware/check-auth")

router.get('/count', checkAuth, dashboardHandler.fetchCount)

router.get("/up/count", dashboardHandler.fetchUpCount);

module.exports = router