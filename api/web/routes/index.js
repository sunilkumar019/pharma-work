const router = require('express').Router()
    //import handler and setting endpoints
router.use("/division/", require("./division"));
router.use("/product/", require("./product"));
router.use("/offer/", require("./offer"))
router.use("/franchisee/", require("./franchisee"))
router.use("/rep/", require("./rep"))
router.use("/admin/", require("./admin"));
router.use("/states/", require("./stateCity"));
router.use("/orders/", require("./company_order"));
router.use("/notification", require("./notification.js"))
router.use("/customer", require("./customer.js"))
router.use("/about", require("./company_about"))
router.use("/promo", require("./promotional_material"))
router.use("/enquiry/", require("./enquiry"))
router.use("/certificate/", require("./certificate"))
router.use("/reports", require("./reports"))
router.use("/dashboard", require("./dashboard.js"))

router.use("/employee/", require("./employee"))




//not found checker
router.use((req, res, next) => {
    //req.route gets initialized if path gets matched
    if (!req.route) {
        req.status = 404
        return next(new Error('Not Found'))
    }
    next()
})

//response formatter
router.use((req, res, next) => {
    const data = req.data
    let message = null;
    if (req.message) message = req.message;
    res.send({ success: true, message, data })
})

//error handler
router.use((error, req, res, next) => {
    const message = error.message || 'Something went wrong'
    const status = req.status || 500
    res.status(status).send({ success: false, message: message, data: null })
})

module.exports = router