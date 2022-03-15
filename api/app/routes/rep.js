const router = require('express').Router()
const repHandler = require('../handlers/rep')
const checkAuth = require("../../../core/middleware/check-auth")

router.post('/add', checkAuth, repHandler.addRep)

//if rep is owner (for getting all reps )
router.post('/get', checkAuth, repHandler.getRep);

router.post('/search', repHandler.searchRep);

router.post('/verifyotp', repHandler.verifyOtp);

router.post('/resetaccount', repHandler.resetRepPassword);

router.post("/login", repHandler.repLogin);
//if logged in
router.get('/profile', checkAuth, repHandler.getRepProfile)
    //if logged in
router.post('/update', checkAuth, repHandler.updateRep)
    //if logged in
router.post('/changePassword', checkAuth, repHandler.changePassword)

//reset password of any rep if rep is owner
router.post('/resetPassword', checkAuth, repHandler.resetPassword);
//activate rep by owner
router.get('/activate/:Id', checkAuth, repHandler.activateRep)
    //count by owner
router.get('/count', checkAuth, repHandler.getRepCount)

router.get('/deactivate/:Id', checkAuth, repHandler.deactivateRep)

// Delete Rep
router.delete('/mr-delete/:id', checkAuth, repHandler.deleteMr)

router.post('/mr-update', checkAuth, repHandler.updateMr)

/*****************Rep daily report by date ************/
router.post('/report', checkAuth, repHandler.getReport)

/*************Rep visits routes****************/
router.post('/visit/add', checkAuth, repHandler.addRepVisit);

router.post('/visit/get', checkAuth, repHandler.getRepVisit);

router.post('/visit/getWorkAnalysis', checkAuth, repHandler.getRepVisitAnalysis);


router.get('/logout', checkAuth, repHandler.logout);


module.exports = router
