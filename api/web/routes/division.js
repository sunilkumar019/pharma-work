const router = require('express').Router()
const divisionHandler = require('../handlers/division')
const check_auth = require("../../../core/middleware/check-auth-admin");

router.post('/add',check_auth, divisionHandler.addDivision)

router.post('/get', check_auth, divisionHandler.getDivision)

router.post('/update', check_auth, divisionHandler.updateDivision)

router.get('/delete/:Id', check_auth, divisionHandler.deleteDivision)

module.exports = router