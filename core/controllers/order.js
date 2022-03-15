//import use cases
const addOrder = require("../usecases/order/addOrder");
const deleteOrder = require("../usecases/order/deleteOrder");
const countOrder = require("../usecases/order/countOrder");
const getOrder = require("../usecases/order/getOrders");
const updateOrder = require("../usecases/order/updateOrder");

const RepCtrl = require("../controllers/rep");
//import moment for date formatting
const moment = require("moment");
const fs = require("fs");

//Add Order 
exports.addOrder = async(order) => {

    if (!order.customer_id) throw new Error('Customer Id is Required');
    if (!order.orderlist) throw new Error('Order List is Required');

    let neworder = {
        customer_id: order.customer_id,
        rep_id: order.rep_id,
        franchisee_id: order.franchisee_id,
        orderlist: order.orderlist,
        created_on: new Date(Date.now())
    }
    let savedorder = await addOrder(neworder);
    console.log("savedorder: ",savedorder)
    delete savedorder.__v

    //notification module
    if (process.env.NOTIFICATION_STATUS) {
        let distributors = await RepCtrl.getRep({franchisee_id: order.franchisee_id, is_owner: true});
        const sendNotification = require("../../firebase_notification");
        let orderDEtails = await exports.getOrder({ id: savedorder._id });

        for(let i=0; i< distributors.length; i++){
            let rep = distributors[i];
            if(rep.device_token){
                let message = "Order From " + orderDEtails[0].rep_name + " MR is Recived on " + orderDEtails[0].created_on;
                let notificationResponse = await sendNotification({ title: "New Order Received", message: message }, rep.device_token)
            }
        }
    }
    return savedorder;
}

//get Order
exports.getOrder = async(orderprops) => {
    let filter = {}

    if (orderprops && orderprops.id) filter._id = orderprops.id;
    if (orderprops && orderprops.rep_id) filter.rep_id = orderprops.rep_id;
    if (orderprops && orderprops.customer_id) filter.customer_id = orderprops.customer_id;
    if (orderprops &&  orderprops.franchisee_id) filter.franchisee_id = orderprops.franchisee_id;
    let orderRecords = await getOrder(filter);

    if (orderRecords.length === 0){
        return [];
    }

    orderRecords = orderRecords.map(it => {
        return {
            id: it._id,
            customer_id: it.customer_id._id,
            customer_name: it.customer_id.name,
            rep_id: it.rep_id._id,
            rep_name: it.rep_id.name,
            // franchisee_id: it.franchisee_id._id,
            // franchisee_name: it.franchisee_id.name,
            created_on: moment(it.created_on).format("LLL"),

            orderlist: it.orderlist.map(item => {
                item = item.toObject()
                let images = null
                if (item.product_id && item.product_id.hasOwnProperty('images')) {
                    let tmpImages = item.product_id.images;
                    if (tmpImages.length > 0){
                        images = []
                        tmpImages.forEach(img => {
                            delete img._id;
                            if(fs.existsSync(img.url))
                                images.push({
                                    type: img.type,
                                    url :`${process.env.BASE_URL}/${img.url}`
                                })
                        })
                    }
                    return {
                        product: {
                            id: item.product_id._id,
                            name: item.product_id.name,
                            price: item.product_id.price,
                            description: item.product_id.description,
                            details: item.product_id.details,
                            images,
                            min_order_qty: item.product_id.min_order_qty,
                            division_id: item.product_id.division_id._id,
                            division_name: item.product_id.division_id.name,
                            type_id: item.product_id.type_id._id,
                            type_name: item.product_id.type_id.name,
                            category_id: item.product_id.category_id._id,
                            category_name: item.product_id.category_id.name,
                            created_on: moment(item.product_id.created_on).format("LLL"),
                            modified_on: moment(item.product_id.modified_on).format("LLL"),
                        },
                        quantity: item.quantity,
                        packing_type: item.packing_type ? item.packing_type : ""
                    }
                }
                return null;
            })
        }
    })
    return orderRecords;
}

//count orders
exports.countOrder = async(props) => {
    let filter = {};

    if (props.rep_id) filter.rep_id = props.rep_id;
    if (props.customer_id) filter.customer_id = props.customer_id;
    filter.franchisee_id = props.franchisee_id;

    let orderCount = await countOrder(filter);

    return { count: orderCount };
}

//update Order    not done
exports.updateOrder = async(orderprops) => {
    if (!orderprops.repIsOwner) throw new Error("Not Authorized!!!");

    let orderId = orderprops.id;
    if (!orderprops.id) throw new Error("Please provide order Id");
    let filter = {}
    if (orderprops.name) filter.name = orderprops.name;
    if (orderprops.address) filter.address = orderprops.address;
    if (orderprops.email) filter.email = orderprops.email;
    if (orderprops.phone) filter.phone = orderprops.phone;
    if (orderprops.active) filter.active = orderprops.active;
    filter.modified_on = new Date(Date.now());
    let orderRecords = await updateOrder(orderId, filter);
    orderRecords = orderRecords.map(it => {
        return {
            id: it._id,
            name: it.name,
            email: it.email,
            phone: it.phone,
            address: it.address,
            active: it.active,
            created_on: moment(it.created_on).format("LLL"),
            modified_on: moment(it.modified_on).format("LLL"),
        }
    })
    return orderRecords;
}
//delete Order   not done
exports.deleteOrder = async(orderId) => {
    if (!orderId) throw new Error("Please provide order Id");

    let orderResponse = await deleteOrder(orderId);
    return orderResponse;
}