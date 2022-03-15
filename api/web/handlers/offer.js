const offerController = require("../../../core/controllers/offer")

const addOffer = async (req, res, next) => {

    try {
        let Offer = await offerController.addOffer(req.files, req.body)
        req.data = Offer
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const getOffer = async (req, res, next) => {
    try {
        let offers = await offerController.getOffer(req.body)
        req.data = offers
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}


const countOffer = async (req, res, next) => {
    try {
        let offerCount = await offerController.countOffer();
        req.data = offerCount
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const updateOffer = async (req, res, next) => {
    try {
        let offerRecords = await offerController.updateOffer(req.files, req.body)
        req.data = offerRecords
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

deleteOffer = async (req, res, next) => {

    try {
        let OfferRes = await offerController.deleteOffer(req.params.Id)
        if (OfferRes.Error) {
            req.status = 400;
            next(OfferRes.Error)
        }
        else {
            req.message = OfferRes.Message;
            req.data = null;
            next()
        }
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}


module.exports = { addOffer, getOffer, countOffer, updateOffer, deleteOffer  }//, updateOffer, deleteOffer