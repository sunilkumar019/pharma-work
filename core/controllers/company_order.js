//import use cases
const addOrder = require("../usecases/companyOrder/addOrder");
const countOrder = require("../usecases/companyOrder/countOrder");
const getOrder = require("../usecases/companyOrder/getOrders");
const deleteOrder = require("../usecases/companyOrder/deleteOrder");
const deleteOrders = require("../usecases/companyOrder/deleteOrders");


const getRep = require("../usecases/rep/getRep");
const getFranchisee = require("../usecases/franchisee/getFranchisee");
const getProduct = require("../usecases/product/getProduct");

// const getAdmin = require("../usecases/admin/getAdmin");
const divisionController = require("./division");


const sendEmail = require("../usecases/Email");
//import moment for date formatting
const moment = require("moment");
//Formatter
const Formatter = require("../Formatters/index")

const fs = require("fs")
//Add Order
exports.addOrder = async (order) => {
    if (!order.orderlist) throw new Error('Order List is Required');

    let neworder = {
        rep_id: order.rep_id,
        franchisee_id: order.franchisee_id,
        orderlist: order.orderlist,
        created_on: new Date(Date.now())
    }
    let savedorder = await addOrder(neworder);

    let filter = {};

    filter._id = order.rep_id
    let repRecord = await getRep(filter);

    repRecord = Formatter.RepFormatter(repRecord);
    //distributor info
    let repInfo = {
        name: repRecord.name,
        phone: repRecord.phone,
    }

    let franchiseeRecord = await getFranchisee({ _id: order.franchisee_id });
    franchiseeRecord = Formatter.franchiseeFormatter(franchiseeRecord[0]);
    //franchisee info
    let franchiseeInfo = {
        name: franchiseeRecord.name
    }

    let productRecords = [];
    let divisionIds = [];
    // name, price, description, division_name, type_name, category_name, quantity
    for (let i = 0; i < order.orderlist.length; i++) {
        let orderedproduct = await getProduct({ _id: order.orderlist[i].product_id });
        orderedproduct = Formatter.ProductFormatter(orderedproduct[0])
        orderedproduct.quantity = order.orderlist[i].quantity;
        orderedproduct.packing_type = order.orderlist[i].packing_type ? order.orderlist[i].packing_type : "";

        divisionIds.push((orderedproduct.division_id).toString());
        delete orderedproduct.id;
        delete orderedproduct.images;
        delete orderedproduct.min_order_qty;
        delete orderedproduct.division_id;
        delete orderedproduct.type_id;
        delete orderedproduct.category_id;
        delete orderedproduct.active;
        delete orderedproduct.new_launched;
        delete orderedproduct.created_on;
        delete orderedproduct.modified_on;

        productRecords.push(orderedproduct);
    }

    divisionIds = [...new Set(divisionIds)]
    //product info in table row format
    let productInfo = ``;
    for (let i = 0; i < productRecords.length; i++) {
        productInfo = `${productInfo}
        <tr>
            <td>${productRecords[i].name}</td>
            <td>${productRecords[i].price}</td>
            <td>${productRecords[i].description}</td>
            <td>${productRecords[i].division_name}</td>
            <td>${productRecords[i].type_name}</td>
            <td>${productRecords[i].category_name}</td>
            <td>${productRecords[i].quantity} ${productRecords[i].packing_type}</td>
        </tr>`;
    }

    let message = `<h3>Order Placed</h3>
        <h3>Franchisee Name: ${franchiseeInfo.name}</h3>
        <h3>Distributor Name: ${repInfo.name}</h3>
        <h3>Distributor Phone Number: ${repInfo.phone}</h3>
        <h3>Products Information</h3>
        <table border cellpadding='5px'>
        <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Division</th>
            <th>Type</th>
            <th>Category</th>
            <th>Quantity</th>
        </tr>
        ${productInfo}
    </table>`;

    let divisions = await divisionController.getDivision({});

    let EmailData = {
        To: '',
        Subject: "New Order Placed By " + repInfo.name + " at " + moment(new Date(Date.now())).format("LLL"),
        Body: message
    }


    for (let i = 0; i < divisions.length; i++) {
        let row = divisions[i];

        if (divisionIds.includes((row.id).toString())) {
            EmailData.To = row.email;
            let rs = await sendEmail(EmailData);
        }
    }







    //***************************** */
    delete savedorder.__v
    return savedorder;
}

//get Order
exports.getOrder = async (orderprops) => {
    let filter = {}
    if (orderprops && orderprops.id) filter._id = orderprops.id;
    if (orderprops && orderprops.rep_id) filter.rep_id = orderprops.rep_id;
    if (orderprops && orderprops.franchisee_id) filter.franchisee_id = orderprops.franchisee_id;

    let orderRecords = await getOrder(filter);

    if (orderRecords.length === 0){
        return [];
    }
    orderRecords = orderRecords.map(it => {
        return {
            id: it._id,
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
                    if (tmpImages.length > 0) {
                        images = [];
                        tmpImages.forEach(img => {
                            delete img._id;
                            if (fs.existsSync(img.url))
                                images.push({
                                    type: img.type,
                                    url: `${process.env.BASE_URL}/${img.url}`
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
exports.countOrder = async (props) => {
    let filter = {};

    if (props.rep_id) filter.rep_id = props.rep_id;
    if (props.franchisee_id) filter.franchisee_id = props.franchisee_id;

    let orderCount = await countOrder(filter);

    return { count: orderCount };
}

//delete order
exports.deleteOrder = async (orderId) => {
    if (!orderId) throw new Error("Please provide Order Id");

    let OrderResponse = await deleteOrder(orderId);
    return OrderResponse;

}

exports.deleteOrders = async (action, body) => {
    let query = {}
    if(action === 'all') {
        return  await deleteOrders(query)
    }
    const ids = body.orderIds.split(",");
    query = { _id: { $in: ids } }
    return  await deleteOrders(query)
}