const router = require('express').Router()
const promoHandler = require('../handlers/promotional_material')
let multer = require('multer');
const check_auth = require("../../../core/middleware/check-auth-admin");

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './core/uploads/promotinalPics')
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


router.post('/add', check_auth, upload.single('image'), promoHandler.add)

router.post('/', check_auth, promoHandler.get)

router.post('/update', check_auth, upload.single('image'), promoHandler.update)

router.delete('/delete/:Id', check_auth, promoHandler.remove)

module.exports = router