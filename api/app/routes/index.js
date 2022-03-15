const router = require('express').Router()
//import handler and setting endpoints routes

router.get('/check', async (req, res, next) => {

    try {
        const adminInfo = await require("../../../core/controllers/admin").getAdminDetails();


        if (process.env.APP_STATUS) {
            if (process.env.APP_STATUS === "1") {
                throw new Error(`<p>Your app has been closed. Contact to admin</p><a href="${adminInfo.email || ''}"> ${adminInfo.email || ""}</a><br/><a href="tel:${adminInfo.phone || ''}"> ${adminInfo.phone || ""}</a>`);
            }
            else if (process.env.APP_STATUS === "2") {
                throw new Error(`<p>Your app has been closed due to technical issue. Contact to admin</p><a href="${adminInfo.email || ''}"> ${adminInfo.email || ""}</a><br/><a href="tel:${adminInfo.phone || ''}"> ${adminInfo.phone || ""}</a>`);
            }
            else if (process.env.APP_STATUS === "3") {
                throw new Error(`<p>Your service has been temporary suspended. Contact to admin</p><a href="${adminInfo.email || ''}"> ${adminInfo.email || ""}</a><br/><a href="tel:${adminInfo.phone || ''}"> ${adminInfo.phone || ""}</a>`);
            }
            else {
                req.data = null;
                next();
            }
        }
        else {
            req.data = null;
            next();
        }
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
})

//rep registration fields
router.get('/registration/fields', async (req, res, next) => {

    try {
        req.data = {
            firm: {
                GST_NUMBER: process.env.FIRM_GST_NUMBER == undefined ? true : process.env.FIRM_GST_NUMBER == "true" ? true : false,
                DRUG_LICENCE: process.env.FIRM_DRUG_LICENCE == undefined ? true : process.env.FIRM_DRUG_LICENCE == "true" ? true : false,
                PHONE: process.env.FIRM_PHONE == undefined ? true : process.env.FIRM_PHONE == "true" ? true : false,
                EMAIL: process.env.FIRM_EMAIL == undefined ? true : process.env.FIRM_EMAIL == "true" ? true : false,
                ADDRESS: process.env.FIRM_ADDRESS == undefined ? true : process.env.FIRM_ADDRESS == "true" ? true : false,
                DISTRICT: process.env.FIRM_DISTRICT == undefined ? true : process.env.FIRM_DISTRICT == "true" ? true : false,
                STATE: process.env.FIRM_STATE == undefined ? true : process.env.FIRM_STATE == "true" ? true : false,
                LOGO_URL: process.env.FIRM_LOGO_URL == undefined ? true : process.env.FIRM_LOGO_URL == "true" ? true : false,
                BANK_ACC_NO: process.env.FIRM_BANK_ACC_NO == undefined ? true : process.env.FIRM_BANK_ACC_NO == "true" ? true : false,
                BANK_IFSC: process.env.FIRM_BANK_IFSC == undefined ? true : process.env.FIRM_BANK_IFSC == "true" ? true : false,
                BANK_NAME: process.env.FIRM_BANK_NAME == undefined ? true : process.env.FIRM_BANK_NAME == "true" ? true : false,
                BANK_PAYEE_NAME: process.env.FIRM_BANK_PAYEE_NAME == undefined ? true : process.env.FIRM_BANK_PAYEE_NAME == "true" ? true : false
            },

            rep: {
                CITY: process.env.REP_CITY == undefined ? true : process.env.REP_CITY == "true" ? true : false,
                STATE: process.env.REP_STATE == undefined ? true : process.env.REP_STATE == "true" ? true : false,
                ADDRESS: process.env.REP_ADDRESS == undefined ? true : process.env.REP_ADDRESS == "true" ? true : false,
                DOB: process.env.REP_DOB == undefined ? true : process.env.REP_DOB == "true" ? true : false,
                OP_AREA: process.env.REP_OP_AREA == undefined ? true : process.env.REP_OP_AREA == "true" ? true : false,
                JOINED_ON: process.env.REP_JOINED_ON == undefined ? true : process.env.REP_JOINED_ON == "true" ? true : false,
                AADHAR_NO: process.env.REP_AADHAR_NO == undefined ? true : process.env.REP_AADHAR_NO == "true" ? true : false,
                PROFILE_PIC: process.env.REP_PROFILE_PIC == undefined ? true : process.env.REP_PROFILE_PIC == "true" ? true : false
            }
        };
        next();
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
})

router.use('/franchisee/', require("./franchisee"))
router.use('/rep/', require("./rep"));
router.use('/customer/', require("./customer"));
router.use("/product/", require("./product"));
router.use("/order/", require("./order"))
router.use("/companyOrder/", require("./company_order"))
router.use("/offer/", require("./offer"))
router.use("/states/", require("./stateCity"));
router.use("/about/", require("./company_about"));
router.use("/enquiry/", require("./enquiry"));

router.use("/dashboard/", require("./dashboard"));

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
    res.status(status).send({ success: false, message, data: null })
})

module.exports = router