const productController = require("../../../core/controllers/product");
const offerController = require("../../../core/controllers/offer");
const repController = require("../../../core/controllers/rep");
const companyOrderController = require("../../../core/controllers/company_order");
const orderController = require("../../../core/controllers/order");



const fetchCount = async (req, res, next) => {
    try {
        let filter = {}
        filter.franchisee_id = req.franchiseeId;
        if (req.repId) filter.rep_id = req.repId;
        let repCount = { count: 0 };
        let companyOrderCount = { count: 0 };
        let orderCount = { count: 0 }

        let productCount = await productController.countProducts(filter);
        let newProductCount = await productController.countProducts({ ...filter, new_launched: true });
        let productVisualaidCount = await productController.countVisualates(filter)
        let favProductCount = await productController.countFavProduct({ rep_id: req.repId })
        let offerCount = await offerController.countOffer(filter);

        if (req.is_owner) {
            repCount = await repController.getRepCount(filter);
            companyOrderCount = await companyOrderController.countOrder(filter);
            orderCount = await orderController.countOrder({ franchisee_id: req.franchiseeId });
        }
        else {
            orderCount = await orderController.countOrder(filter);
        }


        req.data = {
            "product_count": productCount.count,
            "launches_count": newProductCount.count,
            "visualaids_count": productVisualaidCount.count,
            "favourite_product_count": favProductCount.count,
            "offer_count": offerCount.count,
            "mr_count": repCount.count,
            "company_order_count": companyOrderCount.count,
            "order_count": orderCount.count
        }
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const fetchUpCount = async (req, res, next) => {
    try {
        let productCount = await productController.countProducts({});
        let newProductCount = await productController.countProducts({ new_launched: true });
        let productVisualaidCount = await productController.countVisualates({})

        if (productVisualaidCount !== undefined && productVisualaidCount !== null && productVisualaidCount.length === 0) {
            productVisualaidCount = productVisualaidCount.length
        }
        else {
            productVisualaidCount = productVisualaidCount.count
        }

        req.data = {
            "product_count": productCount.count,
            "launches_count": newProductCount.count,
            "visualaids_count": productVisualaidCount
        }
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

module.exports = { fetchCount, fetchUpCount }