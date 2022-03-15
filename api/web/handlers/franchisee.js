const franchiseeController = require("../../../core/controllers/franchisee");
const fs = require('fs');
const repController = require("../../../core/controllers/rep");

const RegisterRepandFranchisee = async(req,res,next)=>{
    req.status = 400;
    if(req.file)req.body.profile_pic = req.file.path;
    // return next(new Error("Not Authorized!!!"))
    if (!req.body.firm_name) return next( new Error('franchisee Name is Required'));
    if (!req.body.gst_number) //return next( new Error('franchisee gst_number is Required'));
        req.body.gst_number = null;
    if (!req.body.drug_license) //return next( new Error('franchisee drug_license is Required'));
        req.body.drug_license=null;
    if (!req.body.firm_phone) req.body.firm_phone = null;
    if (!req.body.firm_email) req.body.firm_email=null;
    if (!req.body.firm_address) req.body.firm_address=null;
    if (!req.body.firm_state) req.body.firm_state=null;
    if (!req.body.firm_district) req.body.firm_district=null;
    if (!req.body.bank_name) req.body.bank_name =null;
    if (!req.body.bank_ifsc) req.body.bank_ifsc =null;
    if (!req.body.bank_acc_no) req.body.bank_acc_no =null;
    if (!req.body.bank_payee_name) req.body.bank_payee_name =null;

    if (!req.body.name) return next( new Error('rep Name is Required'));
    if (!req.body.email) req.body.email = '';
    if (!req.body.phone) return next( new Error('rep phone is Required'));
    if (!req.body.address) //return next( new Error('rep address is Required'));
        req.body.address=null;
    if (!req.body.dob) //return next( new Error('rep dob is Required'));
        req.body.dob=null;
    if (!req.body.password) return next( new Error('rep password is Required'));
    if (!req.body.op_area)// return next( new Error('rep Operation area is Required'));
        req.body.op_area=null;
    if(!req.body.city) req.body.city = null;
    if(!req.body.state) req.body.state = null;

    if(!req.body.active) req.body.state = true;

    let franchiseeData = {
        name:req.body.firm_name,
        gst_number:req.body.gst_number,
        drug_license:req.body.drug_license,
        phone:req.body.firm_phone,
        email:req.body.firm_email,
        address:req.body.firm_address,
        state:req.body.firm_state,
        district:req.body.firm_district,
        bank_acc_no:req.body.bank_acc_no,
        bank_ifsc:req.body.bank_ifsc,
        bank_name:req.body.bank_name,
        bank_payee_name:req.body.bank_payee_name,
        logo_url:null,
        divisions: req.body.divisions
    }

    let repData ={
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        city:req.body.city,
        state:req.body.state,
        address:req.body.address,
        dob:req.body.dob,
        password:req.body.password,
        aadhar_no : req.body.aadhar_no ,
        active : req.body.active,
        op_area:req.body.op_area,
        is_owner :true,
        profile_pic: req.body.profile_pic ? req.body.profile_pic : null
    }
    try {
        // let repCheck = await repController.getRep({email:repData.email});
        // if(repCheck.length>0)
        //     return next( new Error('Rep already exists!!!'));
        let franchisee = await franchiseeController.addFranchisee(franchiseeData);

        repData.franchisee_id = franchisee._id;
        let rep = await repController.addRep(repData);
        let result = [];
        result.push({franchiseeInfo:franchisee,repInfo:rep});
        req.data = result;
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
};


const addFranchisee =async (req, res, next)=>{
    if(req.file)req.body.logo_url = req.file.path;
    
    try {
        let franchisee = await franchiseeController.addFranchisee(req.body)
        req.data = franchisee
        next()
    }
    catch (e) {
        if(req.file)fs.unlinkSync(req.file.path)
        req.status = 400;
        next(e)
    }
}

const getFranchisee = async(req,res,next)=>{

    try {
        let franchisees = await franchiseeController.getFranchisee(req.body)
        req.data = franchisees
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const updateFranchisee = async(req,res,next)=>{
    if(req.file)req.body.logo_url = req.file.path;
    
    try {
        let divisionRecords = await franchiseeController.updateFranchisee(req.body)
        req.data = divisionRecords
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const deleteFranchisee = async(req,res,next)=>{
    try {
        let franchisee = await franchiseeController.deleteFranchisee(req.params.Id)
        req.data = franchisee
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const deactivateFranchisee = async(req,res,next)=>{
    try {
        let franchisee = await franchiseeController.deactivateFranchisee(req.params.Id)
        req.data = franchisee
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const activateFranchisee = async(req,res,next)=>{
    try {
        let franchisee = await franchiseeController.activateFranchisee(req.params.Id)
        req.data = franchisee
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const countFranchisee = async(req,res,next)=>{
    try {
        let franchisee = await franchiseeController.countFranchisee()
        req.data = franchisee
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}


module.exports = {RegisterRepandFranchisee, addFranchisee, getFranchisee, updateFranchisee, deleteFranchisee, deactivateFranchisee, activateFranchisee, countFranchisee}