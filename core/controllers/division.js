//import use cases
const addDivision = require("../usecases/division/addDivision")
const deleteDivision = require("../usecases/division/deleteDivision")
const getDivision = require("../usecases/division/getDivisions")
const updateDivision = require("../usecases/division/updateDivision");
//product controller
const productController = require("./product");
//franchisee controller
const franchiseeCtrl = require("./franchisee")

//import moment for date formatting
const moment = require("moment");

//Add division
exports.addDivision = async (division)=>{

    if (!division.name) throw new Error('Division Name is Required');
    
    if(!division.address) division.address = null;

    if(!division.email) division.email = null;

    if(!division.phone) division.phone = null;

    if(!division.active) division.active = true;

    let newdivision = {
        name: division.name,
        address: division.address,
        email: division.email,
        phone: division.phone,
        active:division.active,
        created_on: new Date(Date.now())
    }
    let saveddivision = await addDivision(newdivision);

    delete saveddivision.__v
    delete saveddivision.modified_on
    delete saveddivision.created_on 

    return saveddivision;
}

//get division
exports.getDivision = async(divisionprops)=>{
    let filter ={}
    if (divisionprops.id) filter._id = divisionprops.id;

    if (divisionprops.name) filter.name = divisionprops.name;

    if(divisionprops.email) filter.email = divisionprops.email;

    if(divisionprops.phone) filter.phone = divisionprops.phone;

    if(divisionprops.active) filter.active = divisionprops.active;
    
    let DivisionRecords = await getDivision(filter);

    if(DivisionRecords.length==1 && divisionprops.id){
        DivisionRecords =  {
            id:DivisionRecords[0]._id,
            name: DivisionRecords[0].name,
            email: DivisionRecords[0].email,
            phone: DivisionRecords[0].phone,
            address: DivisionRecords[0].address,
            active: DivisionRecords[0].active,
            created_on: moment(DivisionRecords[0].created_on).format("LLL"),
            modified_on: moment(DivisionRecords[0].modified_on).format("LLL"),
            }
    }
    else
    {
        DivisionRecords = DivisionRecords.map(it => {
        
        return {
            id:it._id,
            name: it.name,
            email: it.email,
            phone: it.phone,
            address: it.address,
            active: it.active,
            created_on: moment(it.created_on).format("LLL"),
            modified_on: moment(it.modified_on).format("LLL"),
            }
        })
    }
    return DivisionRecords;
}

//update division
exports.updateDivision = async(divisionprops)=>{
    let divisionId = divisionprops.id;
    if(!divisionprops.id) throw new Error("Please provide Division Id");
    let filter = {}
    if(divisionprops.name) filter.name = divisionprops.name;
    if(divisionprops.address) filter.address = divisionprops.address;
    if(divisionprops.email) filter.email = divisionprops.email;
    if(divisionprops.phone) filter.phone = divisionprops.phone;
    if(divisionprops.active) filter.active = divisionprops.active;
    filter.modified_on = new Date(Date.now());
    let DivisionRecords = await updateDivision(divisionId,filter);
    DivisionRecords = DivisionRecords.map(it => {
        return {
            id:it._id,
            name: it.name,
            email: it.email,
            phone: it.phone,
            address: it.address,
            active: it.active,
            created_on: moment(it.created_on).format("LLL"),
            modified_on: moment(it.modified_on).format("LLL"),
            }
     })
     return DivisionRecords;
}
//delete division
exports.deleteDivision = async(divisionId)=>{
    if(!divisionId) throw new Error("Please provide Division Id");

    let franchiseeTemp = await franchiseeCtrl.getFranchisee({});
    franchiseeTemp.forEach(it => {
        if(it.divisions)
            it.divisions.forEach(div => {
                if(div.id == divisionId)
                    throw new Error("Unable to Delete Division because it is linked with some Franchisee!!!")
            })
    })

    let allProducts = await productController.getProduct({});
    let flag = 0
    allProducts.forEach(it => {
        if(it.division_id == divisionId) flag++;

    })
    if(flag>0) throw new Error("Unable to Delete Division because it is linked with some product!!!")
    else{
        let DivisionResponse = await deleteDivision(divisionId);
        return DivisionResponse;
    }
}