const fs = require('fs');
require('dotenv').config();


//depricated
exports.createConfigFileInDashboard = (filePath) =>{
    
    let fields = {
        PRODUCT_PRICE: process.env.PRODUCT_PRICE ,
        PRODUCT_MOQ: process.env.PRODUCT_MOQ ,
        PRODUCT_TECHNICAL_DETAILS: process.env.PRODUCT_TECHNICAL_DETAILS ,
        PRODUCT_PACKING: process.env.PRODUCT_PACKING ,
        PRODUCT_PACKING_TYPE: process.env.PRODUCT_PACKING_TYPE ,
        PRODUCT_SKU: process.env.PRODUCT_SKU ,
        PRODUCT_HSN_CODE: process.env.PRODUCT_HSN_CODE ,
        PRODUCT_DETAILS: process.env.PRODUCT_DETAILS ,



        
        FIRM_GST_NUMBER: process.env.FIRM_GST_NUMBER == undefined ? true : process.env.FIRM_GST_NUMBER == "true" ? true : false ,
        FIRM_DRUG_LICENCE: process.env.FIRM_DRUG_LICENCE == undefined ? true : process.env.FIRM_DRUG_LICENCE == "true" ? true : false,
        FIRM_PHONE: process.env.FIRM_PHONE == undefined ? true : process.env.FIRM_PHONE == "true" ? true : false,
        FIRM_EMAIL: process.env.FIRM_EMAIL == undefined ? true : process.env.FIRM_EMAIL == "true" ? true : false,
        FIRM_ADDRESS: process.env.FIRM_ADDRESS == undefined ? true : process.env.FIRM_ADDRESS == "true" ? true : false,
        FIRM_DISTRICT: process.env.FIRM_DISTRICT == undefined ? true : process.env.FIRM_DISTRICT == "true" ? true : false,
        FIRM_STATE: process.env.FIRM_STATE == undefined ? true : process.env.FIRM_STATE == "true" ? true : false,
        FIRM_LOGO_URL: process.env.FIRM_LOGO_URL == undefined ? true : process.env.FIRM_LOGO_URL == "true" ? true : false,
        FIRM_BANK_ACC_NO: process.env.FIRM_BANK_ACC_NO == undefined ? true : process.env.FIRM_BANK_ACC_NO == "true" ? true : false,
        FIRM_BANK_IFSC: process.env.FIRM_BANK_IFSC == undefined ? true : process.env.FIRM_BANK_IFSC == "true" ? true : false,
        FIRM_BANK_NAME: process.env.FIRM_BANK_NAME == undefined ? true : process.env.FIRM_BANK_NAME == "true" ? true : false,
        FIRM_BANK_PAYEE_NAME: process.env.FIRM_BANK_PAYEE_NAME == undefined ? true : process.env.FIRM_BANK_PAYEE_NAME == "true" ? true : false,
        
        REP_CITY: process.env.REP_CITY == undefined ? true : process.env.REP_CITY == "true" ? true : false,
        REP_STATE: process.env.REP_STATE == undefined ? true : process.env.REP_STATE == "true" ? true : false,
        REP_ADDRESS: process.env.REP_ADDRESS == undefined ? true : process.env.REP_ADDRESS == "true" ? true : false,
        REP_DOB: process.env.REP_DOB == undefined ? true : process.env.REP_DOB == "true" ? true : false,
        REP_OP_AREA: process.env.REP_OP_AREA == undefined ? true : process.env.REP_OP_AREA == "true" ? true : false,
        REP_JOINED_ON: process.env.REP_JOINED_ON == undefined ? true : process.env.REP_JOINED_ON == "true" ? true : false,
        REP_AADHAR_NO: process.env.REP_AADHAR_NO == undefined ? true : process.env.REP_AADHAR_NO == "true" ? true : false,
        REP_PROFILE_PIC: process.env.REP_PROFILE_PIC == undefined ? true : process.env.REP_PROFILE_PIC == "true" ? true : false
    }
    let APP_NAME = process.env.APP_NAME;
    
    let props = '';
    for (const [key, value] of Object.entries(fields)) {
        if(value != undefined)
        props +=`${key}: ${value}, `;
    }

    // if(!fs.existsSync(filePath)){
        let data = `module.exports = { APP_NAME :"${APP_NAME}", ${props} };`;
        fs.writeFileSync(filePath, data)
    // }
};


//creates a file in frontend with host name 
exports.createConstantfileinFrontEnd = (filePath) =>{
    
    let fields = {
        SERVER_URL: "'"+ process.env.BASE_URL+"'",


        PRODUCT_PRICE: process.env.PRODUCT_PRICE ,
        PRODUCT_MOQ: process.env.PRODUCT_MOQ ,
        PRODUCT_TECHNICAL_DETAILS: process.env.PRODUCT_TECHNICAL_DETAILS ,
        PRODUCT_PACKING: process.env.PRODUCT_PACKING ,
        PRODUCT_PACKING_TYPE: process.env.PRODUCT_PACKING_TYPE ,
        PRODUCT_SKU: process.env.PRODUCT_SKU ,
        PRODUCT_HSN_CODE: process.env.PRODUCT_HSN_CODE ,
        PRODUCT_DETAILS: process.env.PRODUCT_DETAILS ,



        
        FIRM_GST_NUMBER: process.env.FIRM_GST_NUMBER == undefined ? true : process.env.FIRM_GST_NUMBER == "true" ? true : false ,
        FIRM_DRUG_LICENCE: process.env.FIRM_DRUG_LICENCE == undefined ? true : process.env.FIRM_DRUG_LICENCE == "true" ? true : false,
        FIRM_PHONE: process.env.FIRM_PHONE == undefined ? true : process.env.FIRM_PHONE == "true" ? true : false,
        FIRM_EMAIL: process.env.FIRM_EMAIL == undefined ? true : process.env.FIRM_EMAIL == "true" ? true : false,
        FIRM_ADDRESS: process.env.FIRM_ADDRESS == undefined ? true : process.env.FIRM_ADDRESS == "true" ? true : false,
        FIRM_DISTRICT: process.env.FIRM_DISTRICT == undefined ? true : process.env.FIRM_DISTRICT == "true" ? true : false,
        FIRM_STATE: process.env.FIRM_STATE == undefined ? true : process.env.FIRM_STATE == "true" ? true : false,
        FIRM_LOGO_URL: process.env.FIRM_LOGO_URL == undefined ? true : process.env.FIRM_LOGO_URL == "true" ? true : false,
        FIRM_BANK_ACC_NO: process.env.FIRM_BANK_ACC_NO == undefined ? true : process.env.FIRM_BANK_ACC_NO == "true" ? true : false,
        FIRM_BANK_IFSC: process.env.FIRM_BANK_IFSC == undefined ? true : process.env.FIRM_BANK_IFSC == "true" ? true : false,
        FIRM_BANK_NAME: process.env.FIRM_BANK_NAME == undefined ? true : process.env.FIRM_BANK_NAME == "true" ? true : false,
        FIRM_BANK_PAYEE_NAME: process.env.FIRM_BANK_PAYEE_NAME == undefined ? true : process.env.FIRM_BANK_PAYEE_NAME == "true" ? true : false,
        
        REP_CITY: process.env.REP_CITY == undefined ? true : process.env.REP_CITY == "true" ? true : false,
        REP_STATE: process.env.REP_STATE == undefined ? true : process.env.REP_STATE == "true" ? true : false,
        REP_ADDRESS: process.env.REP_ADDRESS == undefined ? true : process.env.REP_ADDRESS == "true" ? true : false,
        REP_DOB: process.env.REP_DOB == undefined ? true : process.env.REP_DOB == "true" ? true : false,
        REP_OP_AREA: process.env.REP_OP_AREA == undefined ? true : process.env.REP_OP_AREA == "true" ? true : false,
        REP_JOINED_ON: process.env.REP_JOINED_ON == undefined ? true : process.env.REP_JOINED_ON == "true" ? true : false,
        REP_AADHAR_NO: process.env.REP_AADHAR_NO == undefined ? true : process.env.REP_AADHAR_NO == "true" ? true : false,
        REP_PROFILE_PIC: process.env.REP_PROFILE_PIC == undefined ? true : process.env.REP_PROFILE_PIC == "true" ? true : false
    }
    let APP_NAME = process.env.APP_NAME;
    
    let props = '';
    for (const [key, value] of Object.entries(fields)) {
        if(value != undefined)
        props +=`${key}: ${value}, `;
    }

    ;

    // if(!fs.existsSync(filePath)){
        let data = `const C = {APP_NAME: '${APP_NAME}', API_URL : "", ${props} }; export default C `;
        fs.writeFileSync(filePath, data)
    // }
};

exports.dataOfStateCitiesFile = () => {
    let data = fs.readFileSync(`${__dirname}/state_cities.json`);
    return (JSON.parse(data))
}

exports.createEssentialDirectories = () => {
    let uploads = './core/uploads';
    let admin = `${uploads}/admin`;
    let download = `${uploads}/download`;
    let franchisee = `${uploads}/franchisee`;
    let offers = `${uploads}/offers`;
    let products = `${uploads}/products`;
        let img = `${products}/img`;
        let techDetails = `${products}/techDetails`;
        let vis = `${products}/vis`;
    let reps = `${uploads}/reps`;
    let temp = `${uploads}/temp`;
    let companyAbout = `${uploads}/companyAbout`;
    let promotinalPics = `${uploads}/promotinalPics`;
    let certificates = `${uploads}/certificates`;

    if(!fs.existsSync(uploads)){
        fs.mkdirSync(uploads);
        fs.mkdirSync(admin);
        fs.mkdirSync(download);
        fs.mkdirSync(franchisee);
        fs.mkdirSync(offers);
        fs.mkdirSync(reps);
        fs.mkdirSync(temp);
        fs.mkdirSync(products);
        fs.mkdirSync(img);
        fs.mkdirSync(techDetails);
        fs.mkdirSync(vis);
        fs.mkdirSync(companyAbout);
        fs.mkdirSync(promotinalPics);
        fs.mkdirSync(certificates);
    }
    else{
        if(!fs.existsSync(admin)) fs.mkdirSync(admin);
        if(!fs.existsSync(download)) fs.mkdirSync(download);
        if(!fs.existsSync(franchisee)) fs.mkdirSync(franchisee);
        if(!fs.existsSync(offers)) fs.mkdirSync(offers);
        if(!fs.existsSync(reps)) fs.mkdirSync(reps);
        if(!fs.existsSync(temp)) fs.mkdirSync(temp);
        if(!fs.existsSync(companyAbout)) fs.mkdirSync(companyAbout);
        if(!fs.existsSync(promotinalPics)) fs.mkdirSync(promotinalPics);
        if(!fs.existsSync(certificates)) fs.mkdirSync(certificates);

        if(!fs.existsSync(products)) fs.mkdirSync(products);
        else{
            if(!fs.existsSync(img)) fs.mkdirSync(img);
            if(!fs.existsSync(techDetails)) fs.mkdirSync(techDetails);
            if(!fs.existsSync(vis)) fs.mkdirSync(vis);
        }     
    }
}
