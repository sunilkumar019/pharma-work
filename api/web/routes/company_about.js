const router = require('express').Router()
const companyAboutHandler = require('../handlers/company_about')
let multer = require('multer');
const check_auth = require("../../../core/middleware/check-auth-admin");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './core/uploads/companyAbout')
  },
  filename: function (req, file, cb) {
      cb(null, (file.originalname).replace(/ /g, '_').toLowerCase())
  }
})

let upload = multer({ storage: storage })

router.post('/', check_auth, upload.fields( [{ name: 'about_img', maxCount: 10 }]), companyAboutHandler.addUpdate)

router.get('/', check_auth, companyAboutHandler.get)

module.exports = router