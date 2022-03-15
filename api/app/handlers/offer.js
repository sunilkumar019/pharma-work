const moment = require("moment");
const offerController = require("../../../core/controllers/offer")

const getOffer = async (req, res, next) => {
    try {
        if (req.repId) req.body.rep_id = req.repId;

        let offers = await offerController.getOffer(req.body);
        let newResp = []

        if (offers) {
            offers.map((it) => {
                if (moment(it.valid_upto, "YYYY/MM/DD").isBefore(moment())) {
                    return false
                }
                else {
                    return newResp.push(it)
                }

            })
        }

        req.data = newResp
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const countOffer = async (req, res, next) => {
    try {
        if (req.repId) req.body.rep_id = req.repId;
        let offerCount = await offerController.countOffer(req.body);
        req.data = offerCount
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

module.exports = { getOffer, countOffer }