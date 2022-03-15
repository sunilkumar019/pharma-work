const router = require('express').Router()
const employeeHandler = require('../handlers/employee')
const check_auth = require("../../../core/middleware/check-auth-admin");

router.post('/add',check_auth, employeeHandler.addEmployee)

router.post('/get', check_auth, employeeHandler.getEmployee)

router.post('/update', check_auth, employeeHandler.updateEmployee)

router.get('/delete/:Id', check_auth, employeeHandler.deleteEmployee)

module.exports = router