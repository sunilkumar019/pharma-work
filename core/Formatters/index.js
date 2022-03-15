const moment = require("moment");
const fs = require("fs");
const { Console } = require("console");

exports.ProductFormatter = (product) => {


    // product = product.toObject()

    let images = null;
    let imagesTmp = product.images;
    if (imagesTmp.length > 0 && imagesTmp) {
        images = [];
        imagesTmp.forEach(img => {
            if (fs.existsSync(img.url))
                images.push({
                    type: img.type,
                    url: fs.existsSync(img.url) ? `${process.env.BASE_URL}/${img.url}` : null
                })
        })
    }

    let technical_detail = null;
    if (!product.technical_detail)
        technical_detail = null;
    else {
        if (fs.existsSync(product.technical_detail)) technical_detail = `${process.env.BASE_URL}${product.technical_detail}`;
        else technical_detail = null
    }


    return {
        id: product._id,
        name: product.name,
        price: product.price,
        description: product.description,
        details: product.details,
        images: images,
        technical_detail: technical_detail,
        min_order_qty: product.min_order_qty,
        division_id: Array.isArray(product.division_id) ? product.division_id[0]._id : product.division_id._id,
        division_name: Array.isArray(product.division_id) ? product.division_id[0].name : product.division_id.name,
        type_id: Array.isArray(product.type_id) ? product.type_id[0]._id : product.type_id._id,
        type_name: Array.isArray(product.type_id) ? product.type_id[0].name : product.type_id.name,
        category_id: Array.isArray(product.category_id) ? product.category_id[0]._id : product.category_id._id,
        category_name: Array.isArray(product.category_id) ? product.category_id[0].name : product.category_id.name,
        active: product.active,
        new_launched: product.new_launched !== null && product.new_launched !== undefined ? product.new_launched : false,
        upcoming : product.upcoming !== null && product.upcoming !== undefined ?  product.upcoming : false ,
        packing_qty : product.packing_qty !== null &&  product.packing_qty !== undefined ?  product.packing_qty : 1,
        packing: product.packing ? ((product.packing).toLowerCase() == "null") ? null : product.packing : null,
        sku: product.sku ? ((product.sku).toLowerCase() == "null") ? null : product.sku : null,
        hsn_code: product.hsn_code ? ((product.hsn_code).toLowerCase() == "null") ? null : product.hsn_code : null,
        packing_type: product.packing_type ? ((product.packing_type).toLowerCase() == "null") ? null : product.packing_type : null,
        created_on: moment(product.created_on).format("LLL"),
        modified_on: moment(product.modified_on).format("LLL"),
    }
}


exports.DivisionFormatter = (division) => {

    return {
        id: division._id,
        name: division.name,
        email: division.email,
        phone: division.phone,
        address: division.address,
        active: division.active,
        created_on: moment(division.created_on).format("LLL"),
        modified_on: moment(division.modified_on).format("LLL"),
    }
}


exports.RepFormatter = (rep) => {
    return {
        id: rep._id,
        name: rep.name,
        email: rep.email,
        phone: rep.phone,
        city: rep.city,
        state: rep.state,
        address: rep.address,
        dob: rep.dob ? moment(rep.dob).format("YYYY/MM/DD") : "NA",
        op_area: rep.op_area,
        joined_on: rep.joined_on,
        profile_pic_url: (rep.profile_pic_url == null) ? null : fs.existsSync(rep.profile_pic_url) ? `${process.env.BASE_URL}/${rep.profile_pic_url}` : null,
        franchisee_id: rep.franchisee_id !== null ? rep.franchisee_id._id : null,
        franchisee_name: rep.franchisee_id !== null ? rep.franchisee_id.name : null,

        // employee : rep.employee && rep.employee !== null ? rep.employee.name : null ,
        // employee_id : rep.employee && rep.employee !== null ? rep.employee.id : null ,

        is_owner: rep.is_owner,
        aadhar_no: rep.aadhar_no,
        active: rep.active,
        device_token: rep.device_token,
        created_on: moment(rep.created_on).format("LLL"),
        modified_on: moment(rep.modified_on).format("LLL"),
    }
}


exports.franchiseeFormatter = (franchisee) => {
    return {
        id: franchisee._id,
        name: franchisee.name,
        gst_number: franchisee.gst_number,
        drug_license: franchisee.drug_license ? franchisee.drug_license == "null" || "" ? null : franchisee.drug_license : franchisee.drug_license,
        email: franchisee.email,
        phone: franchisee.phone,
        address: franchisee.address,
        state: franchisee.state,
        district: franchisee.district,
        logo_url: franchisee.logo_url,
        divisions: franchisee.divisions.map(division => {
            return {
                id: division._id,
                name: division.name,
                email: division.email,
                phone: division.phone,
                address: division.address,
                active: division.active,
                created_on: moment(division.created_on).format("LLL"),
                modified_on: moment(division.modified_on).format("LLL"),
            }
        }),
        active: franchisee.active,
        bank_acc_no: franchisee.bank_acc_no ? franchisee.bank_acc_no == "null" || "" ? null : franchisee.bank_acc_no : franchisee.bank_acc_no,
        bank_ifsc: franchisee.bank_ifsc ? franchisee.bank_ifsc == "null" || "" ? null : franchisee.bank_ifsc : franchisee.bank_ifsc,
        bank_name: franchisee.bank_name ? franchisee.bank_name == "null" || "" ? null : franchisee.bank_name : franchisee.bank_name,
        bank_payee_name: franchisee.bank_payee_name ? franchisee.bank_payee_name == "null" || "" ? null : franchisee.bank_payee_name : franchisee.bank_payee_name,

        created_on: moment(franchisee.created_on).format("LLL"),
        modified_on: moment(franchisee.modified_on).format("LLL"),
    }
}

exports.CompanyAboutFormatter = (about, divisions) => {

    let newImg = [];
    let newRsImg = about.about_img.split(',')
    about.about_img = []

    if (newRsImg.length > 0) {
        newRsImg.map((it) => {
            newImg.push(`${process.env.BASE_URL}/${it}`)
        })
    }


    about.about_img = newImg[0].toString()

    return {
        app_live_link: process.env.APP_LIVE_LINK ? process.env.APP_LIVE_LINK : "https://play.google.com/store",
        ios_app_live_link: process.env.IOS_LIVE_LINK ? process.env.IOS_LIVE_LINK : "https://apps.apple.com/us/app",
        id: about._id,
        phone: about.phone,
        whatsapp: about.whatsapp,
        website: about.website,
        email: about.email,
        about: about.about,
        address: about.address,
        address2: about.address2,
        address3: about.address3,
        address4: about.address4,
        facebook: about.facebook,
        twitter: about.twitter,
        pinterest: about.pinterest,
        linkedin: about.linkedin,
        corporate_video: about.corporate_video,
        whatsapp_greeting: about.whatsapp_greeting ? about.whatsapp_greeting : "Hello",
        download_links: about.download_links ? downloadLinksFormatter(about.download_links, divisions) : [],
        about_imgs: newImg,
        about_img: about.about_img ? about.about_img : null,
        created_on: moment(about.created_on).format("LLL"),
        modified_on: moment(about.modified_on).format("LLL"),
    }
}

const downloadLinksFormatter = (links, divisions) => {

    let response = [];
    if (divisions !== null) {
        for (let i = 0; i < divisions.length; i++) {
            let division = divisions[i];
            let flag = 0;
            for (let j = 0; j < links.length; j++) {
                let link = links[j];
                if (division.division_id == link.division_id._id) {
                    response.push({
                        division_id: link.division_id._id,
                        division_name: link.division_id.name,
                        product_list_link: link.product_list_link,
                        visualaids_link: link.visualaids_link
                    })
                    flag = 1;
                    break;
                }
            }

            if (flag == 0) {
                response.push({
                    division_id: division.division_id,
                    division_name: division.division_name,
                    product_list_link: null,
                    visualaids_link: null
                })
            }
        }
    }
    return response;
}

exports.PromotionaMaterialFormatter = (data) => {

    return {
        id: data._id,
        title: data.title,
        description: data.description || '',
        image: data.image ? fs.existsSync(data.image) ? `${process.env.BASE_URL}/${data.image}` : null : null,
        created_on: moment(data.created_on).format("LLL"),
        modified_on: moment(data.modified_on).format("LLL"),
    }
}
