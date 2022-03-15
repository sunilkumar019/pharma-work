const router = require('express').Router()
const statesHandler = require('../handlers/stateCity')
const check_auth = require("../../../core/middleware/check-auth-admin");

//get all states
router.get('/', check_auth, statesHandler.getStates)
//get all cities by state id
router.get('/:stateId', check_auth, statesHandler.getCities)
//add new state
router.post('/add', check_auth, statesHandler.addState)
//update state
router.post('/update', check_auth, statesHandler.updateState)
//delete state by id
router.get('/delete/:Id', check_auth, statesHandler.deleteState)
//add new city
router.post('/addCity', check_auth, statesHandler.addCity)
//update city
router.post('/updateCity', check_auth, statesHandler.updateCity)
//delete city
router.post('/deleteCity', check_auth, statesHandler.deleteCity)


module.exports = router