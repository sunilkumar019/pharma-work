const router = require('express').Router()
const companyAboutHandler = require('../handlers/company_about')
const promoHandler = require('../handlers/promotional_material')

router.get('/', companyAboutHandler.get)
router.get('/promotional', promoHandler.get)

module.exports = router