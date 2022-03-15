const router = require('express').Router()
const repHandler = require('../handlers/rep')
const check_auth = require("../../../core/middleware/check-auth-admin");
let multer = require('multer');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './core/uploads/reps')
    },
    filename: function (req, file, cb) {
      let tmp = file.originalname.split("."); 
      let fileExtension = tmp[tmp.length - 1];
      let fileName = "";
      for(let i=0 ; i<(tmp.length-1);i++){
        fileName = fileName+tmp[i];
      } 
      cb(null,(((fileName).replace(/ /g,'_').toLowerCase())+"_"+((new Date()).getTime())+"."+fileExtension))
    }
  })
  
let upload = multer({ storage: storage })

router.post('/add', check_auth, upload.single('image'), repHandler.addRep)

router.post('/get', check_auth, repHandler.getRep)

router.get('/get/:Id', check_auth, repHandler.getSingleRep)

router.post('/update',check_auth, upload.single('image'), repHandler.updateRep)

router.get('/activate/:Id',check_auth, repHandler.activateRep)

router.get('/deactivate/:Id', check_auth, repHandler.deactivateRep)

router.get('/delete/:Id', check_auth, repHandler.deleteRep)

router.post('/count', check_auth, repHandler.getRepCount)

router.get('/countDistributors', check_auth, repHandler.distributorsCount)

router.post('/bulkUpload', check_auth, upload.single("reps"),repHandler.bulkUpload)

router.post('/visitsAnalysis', check_auth, repHandler.getRepVisitAnalysis)

router.post('/search', check_auth, repHandler.repSearch);


module.exports = router