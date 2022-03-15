//import use cases
const get = require("../usecases/company_about/get");
const addUpdate = require("../usecases/company_about/addUpdate");
const getDivision = require("../usecases/division/getDivisions")

//import moment for date formatting
// const moment = require("moment");
const { CompanyAboutFormatter } = require("../Formatters");
const moveFile = require("move-file");


exports.addUpdateFile = async(aboutCompany , img) => {
    let Image = [];

    let newImg = []

    if (img && img !== undefined) {
        newImg = [img.about_img]
    }

    if (img !== undefined && img.about_img) {
        newImg.map(it => 
            it.map((item) => {
                moveFile.sync(item.path, "./core/uploads/companyAbout/" + item.originalname)
                Image.push(`core/uploads/companyAbout/${item.originalname}`)
            })
        )
    }
    aboutCompany.image = Image.toString()
    
    let oldData = await get();
    if(oldData.length ==0){
        if(!aboutCompany.phone) throw new Error('Company Phone is Required');
        if(!aboutCompany.whatsapp) throw new Error('Company Whatsapp is Required');
        if(!aboutCompany.website) throw new Error('Company Website is Required');
        if(!aboutCompany.email) throw new Error('Company Email is Required');
        if(!aboutCompany.about) throw new Error('Company About is Required');
        if(!aboutCompany.address) throw new Error('Company Address is Required');
        if(!aboutCompany.image) throw new Error('Company About Image is Required');


        let downloadLinks = typeof(aboutCompany.download_links) == "string"? JSON.parse(aboutCompany.download_links) : aboutCompany.download_links
        let obj = {
            phone: aboutCompany.phone,
            whatsapp: aboutCompany.whatsapp,
            website: aboutCompany.website,
            email: aboutCompany.email,
            about: aboutCompany.about,
            address: aboutCompany.address,
            address2: aboutCompany.address2 ? aboutCompany.address2 : null,
            address3: aboutCompany.address3 ? aboutCompany.address3 : null,
            address4: aboutCompany.address4 ? aboutCompany.address4 : null,
            about_img: aboutCompany.image,
            download_links: downloadLinks ? downloadLinks : [],
            facebook: aboutCompany.facebook? aboutCompany.facebook : null,
            twitter: aboutCompany.twitter? aboutCompany.twitter : null,
            pinterest: aboutCompany.pinterest? aboutCompany.pinterest : null,
            linkedin: aboutCompany.linkedin? aboutCompany.linkedin : null,
            corporate_video: aboutCompany.corporate_video ? aboutCompany.corporate_video : null,
            whatsapp_greeting: aboutCompany.whatsapp_greeting ? aboutCompany.whatsapp_greeting : "Hello",
            created_on: new Date(Date.now())
        }
        let savedResponse = await addUpdate(obj);
        let DivisionsData = await getDivision({});
        let divisions = DivisionsData.map(it=>{
            return {
                division_id: (it._id).toString(),
                division_name: it.name
            }
        })
    
        return CompanyAboutFormatter(savedResponse[0], divisions);
    }
    else{
        let downloadLinks = typeof(aboutCompany.download_links) == "string"? JSON.parse(aboutCompany.download_links) : aboutCompany.download_links
        let obj = {};
        if(aboutCompany.phone) obj.phone = aboutCompany.phone
        if(aboutCompany.whatsapp) obj.whatsapp = aboutCompany.whatsapp
        if(aboutCompany.website) obj.website = aboutCompany.website
        if(aboutCompany.email) obj.email = aboutCompany.email
        if(aboutCompany.about) obj.about = aboutCompany.about
        if(aboutCompany.address) obj.address = aboutCompany.address
        if(aboutCompany.whatsapp_greeting) obj.whatsapp_greeting = aboutCompany.whatsapp_greeting
        if(aboutCompany.address2) obj.address2 = aboutCompany.address2
        else obj.address2 = null;
        if(aboutCompany.address3) obj.address3 = aboutCompany.address3
        else obj.address3 = null;
        if(aboutCompany.address4) obj.address4 = aboutCompany.address4
        else obj.address4 = null;
        if(aboutCompany.image) obj.about_img = aboutCompany.image
        if(aboutCompany.facebook) obj.facebook = aboutCompany.facebook
        else obj.facebook = null;
        if(aboutCompany.twitter) obj.twitter = aboutCompany.twitter
        else obj.twitter = null;
        if(aboutCompany.pinterest) obj.pinterest = aboutCompany.pinterest
        else obj.pinterest = null
        if(aboutCompany.linkedin) obj.linkedin = aboutCompany.linkedin
        else obj.linkedin = null
        if(aboutCompany.corporate_video) obj.corporate_video = aboutCompany.corporate_video
        else obj.corporate_video = null
        if(downloadLinks) obj.download_links = downloadLinks
        else obj.download_links = null
        
        obj._id = oldData[0]._id;
        obj.modified_on = new Date(Date.now())

        let savedResponse = await addUpdate(obj);
    
        let DivisionsData = await getDivision({});
        let divisions = DivisionsData.map(it=>{
            return {
                division_id: (it._id).toString(),
                division_name: it.name
            }
        })
        return CompanyAboutFormatter(savedResponse[0], divisions);
    }
}


exports.get = async() => {
    let Records = await get();
    
    let DivisionsData = await getDivision({});
    let divisions = DivisionsData.map(it=>{
        return {
            division_id: (it._id).toString(),
            division_name: it.name
        }
    })

    if(Records.length ==0) return null
    let certificates = await require("./certificate").getCertificate({});
    
    let aboutData = CompanyAboutFormatter(Records[0], divisions);

    let data = {...aboutData, certificates:certificates}
    return data;
}