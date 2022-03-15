const router = require('express').Router();
const franchiseeHandler = require('../handlers/franchisee');
const check_auth = require("../../../core/middleware/check-auth-admin");

let multer = require('multer');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './core/uploads/franchisee')
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
  });
  
let upload = multer({ storage: storage });

router.post('/addRepAndFranchisee', check_auth, upload.single("profile_pic"), franchiseeHandler.RegisterRepandFranchisee);

router.post('/add', check_auth, upload.single("logo_url"), franchiseeHandler.addFranchisee);

router.post('/get', check_auth, franchiseeHandler.getFranchisee);

router.post('/update', check_auth, upload.single("logo_url"), franchiseeHandler.updateFranchisee);

router.get('/delete/:Id', check_auth, franchiseeHandler.deleteFranchisee);

router.get('/deactivate/:Id', check_auth, franchiseeHandler.deactivateFranchisee);

router.get('/activate/:Id', check_auth, franchiseeHandler.activateFranchisee);

router.get('/count', check_auth, franchiseeHandler.countFranchisee);


module.exports = router;