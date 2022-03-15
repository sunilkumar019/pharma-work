var router = require("express").Router();
var dashboardHandler = require("../handlers/dashboard")

router.get("/getvisits", dashboardHandler.getAllVisits )

module.exports = router;