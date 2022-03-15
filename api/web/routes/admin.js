const router = require('express').Router()
const adminHandler = require('../handlers/admin')
const check_auth = require("../../../core/middleware/check-auth-admin");

let multer = require('multer');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './core/uploads/admin')
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



router.post('/add',upload.single("profile_pic"), adminHandler.addAdmin)

router.post("/login", adminHandler.adminLogin);

//if logged in
router.get('/profile', check_auth, adminHandler.adminProfile)
//if logged in
router.post('/changePassword', check_auth, adminHandler.changeAdminPassword)
//if logged in
router.post('/update',upload.single("profile_pic"), check_auth, adminHandler.updateAdmin)

router.post('/resetPassword', adminHandler.resetAdminPassword);

module.exports = router