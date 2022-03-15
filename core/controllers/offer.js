//import use cases
const addOffer = require("../usecases/offers/addOffer");
const getOffer = require("../usecases/offers/getOffers");
const countOffer = require("../usecases/offers/countOffer");
const updateOffer = require("../usecases/offers/updateOffer");
const deleteOffer = require("../usecases/offers/deleteOffer");
//import moment for date formatting
const moment = require("moment");
const moveFile = require('move-file');

//Add Offer
exports.addOffer = async (offerImage, offer) => {

    if (offer.reps) { offer.reps = (offer.reps).split(","); }
    if (offer.division) { offer.division = (offer.division).split(","); }
    if (!offer.title) throw new Error('offer title is Required');
    if (!offer.description) throw new Error('offer description is Required');
    if (!offer.valid_upto) throw new Error('offer valid_upto is Required');
    // if (!offer.division) throw new Error('offer divison is Required');


    offer.image = null;
    let Image = [];
    if (offerImage.image) {
        Image = offerImage.image.map(it => {
            moveFile.sync(it.path, "./core/uploads/offers/" + it.originalname)
            let path = `core/uploads/offers/` + it.originalname
            return path;
        })
    }

    if (Image.length > 0) offer.image = Image;

    let newoffer = {
        title: offer.title,
        description: offer.description,
        valid_upto: offer.valid_upto,
        image: offer.image,
        division: offer.division,
        reps: offer.reps ? Array.isArray(offer.reps) ? offer.reps : [] : [],
        created_on: new Date(Date.now())
    }

    let savedoffer = await addOffer(newoffer);
    delete savedoffer.__v
    delete savedoffer.created_on

    //notification module
    if (process.env.NOTIFICATION_STATUS) {
        const sendNotification = require("../../firebase_notification")
        let message = offer.title + " is uploaded. Offer is valid upto " + moment(offer.valid_upto).format("YYYY/MM/DD");
        await sendNotification({ title: "New Offer Arrived", message: message }, "Distributor")
    }
    return savedoffer;
}

//get offers
exports.getOffer = async (offerprops) => {
    let filter = {}
    let offerRecords = await getOffer(filter);

    if (offerRecords.length == 1 && offerprops.id) {
        let reps = offerRecords[0].reps ? (offerRecords[0].reps).map(it => {
            return {
                id: it._id,
                name: it.name
            }
        }) : [];

        let division = offerRecords[0].division ? (offerRecords[0].division).map(it => {
            return {
                id: it._id,
                name: it.name
            }
        }) : [];

        return {
            id: offerRecords[0]._id,
            title: offerRecords[0].title,
            description: offerRecords[0].description,
            division: division,
            image: offerRecords[0].image ? process.env.BASE_URL + offerRecords[0].image : `${process.env.BASE_URL}/assets/images/offer.png`,
            images: offerRecords[0].image ?
                Array.isArray(offerRecords[0].image) ?
                    (offerRecords[0].image).map(it => `${process.env.BASE_URL}/${it}`)
                    :
                    [`${process.env.BASE_URL}/${offerRecords[0].image}`]
                :
                [`${process.env.BASE_URL}/assets/images/offer.png`],

            reps: reps,
            created_on: moment(offerRecords[0].created_on).format("YYYY/MM/DD"),
            valid_upto: moment(offerRecords[0].valid_upto).format("YYYY/MM/DD")
        }
    } else {
        offerRecords = offerRecords.map(it => {

            let reps = it.reps ? (it.reps).map(iit => {
                return {
                    id: iit._id,
                    name: iit.name
                }
            }) : [];
            let division = it.division ? (it.division).map(iit => {
                return {
                    id: iit._id,
                    name: iit.name
                }
            }) : [];

            let newImg = Array.isArray(it.image) ? (it.image).map(it => {
                return `${process.env.BASE_URL}/${it}`
            }) : '';


            return {
                id: it._id,
                title: it.title,
                description: it.description,
                reps: reps,
                division: division,
                image: (it.image) ? newImg.toString() : `${process.env.BASE_URL}/assets/images/offer.png`,
                images: it.image ? newImg : [`${process.env.BASE_URL}/assets/images/offer.png`],
                created_on: moment(it.created_on).format("YYYY/MM/DD"),
                valid_upto: moment(it.valid_upto).format("YYYY/MM/DD")
            }
        })
    }


    return offerRecords;
}

//count offers
exports.countOffer = async (props) => {
    let filter = {};
    let offerCount = await countOffer(filter);
    return { count: offerCount };
}


exports.updateOffer = async (offerImage, offerprops) => {
    let offerId = offerprops.id;
    if (offerprops.reps) {
        offerprops.reps = (offerprops.reps).split(",");
    }
    if (offerprops.division) {
        offerprops.division = (offerprops.division).split(",");
    }


    offerprops.image = null;

    let Image = [];

    if (offerImage.image !== undefined && offerImage.image !== null) {
        Image = offerImage.image.map(it => {
            moveFile.sync(it.path, "./core/uploads/offers/" + it.originalname)
            let path = `core/uploads/offers/` + it.originalname
            return path;
        })
    }

    if (Image.length > 0) offerprops.image = Image;
    if (!offerprops.id) throw new Error("Please provide Offer Id");
    let filter = {}
    if (offerprops.title) filter.title = offerprops.title;
    if (offerprops.description) filter.description = offerprops.description;
    if (offerprops.valid_upto) filter.valid_upto = offerprops.valid_upto;
    if (offerprops.image) filter.image = offerprops.image;
    if (offerprops.division)
        if (Array.isArray(offerprops.division)) filter.division = offerprops.division
    if (offerprops.reps)
        if (Array.isArray(offerprops.reps)) filter.reps = offerprops.reps

    let OfferRecords = await updateOffer(offerId, filter);
    return OfferRecords;
}
//delete offer
exports.deleteOffer = async (offerId) => {
    if (!offerId) throw new Error("Please provide Offer Id");

    let Response = await deleteOffer(offerId);
    return Response;
}

