var router = require("express").Router();
var reportsHandler = require("../handlers/reports")

router.post("/getcustomvisits", reportsHandler.getCustomVisits)

router.get("/getbyname", reportsHandler.getByName)

router.post("/download", reportsHandler.downloadDetails)
router.get("/getallmrs", reportsHandler.getAllMrs)

module.exports = router;