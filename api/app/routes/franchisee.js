const router = require('express').Router()
const franchiseeHandler = require('../handlers/franchisee')
const checkAuth = require("../../../core/middleware/check-auth")
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


router.post('/add', franchiseeHandler.addFranchisee)

router.post('/register', upload.single('logo_url'),franchiseeHandler.RegisterRepandFranchisee)

router.get('/get', checkAuth, franchiseeHandler.getFranchisee)

router.post('/update',checkAuth,franchiseeHandler.updateFranchisee)

module.exports = router