const router = require('express').Router()
const employeeHandler = require('../handlers/employee')

router.post('/add', employeeHandler.addEmployee)

router.post('/get',  employeeHandler.getEmployee)


module.exports = router