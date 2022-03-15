const router = require('express').Router()
const statesHandler = require('../handlers/stateCity')


router.get('/',statesHandler.getStates)

router.get('/:stateId',statesHandler.getCities)

// router.post('/add', statesHandler.addState)

// router.post('/update',statesHandler.updateState)

// router.get('/delete/:Id',statesHandler.deleteState)

module.exports = router