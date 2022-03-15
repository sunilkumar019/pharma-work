const franchiseeController = require("../../../core/controllers/franchisee")
const repController = require("../../../core/controllers/rep")

const addFranchisee =async (req, res, next)=>{
    
    try {
        let franchisee = await franchiseeController.addFranchisee(req.body)
        req.data = franchisee
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const RegisterRepandFranchisee = async(req,res,next)=>{
     req.status = 400;
    // return next(new Error("Not Authorized!!!"))
    if (!req.body.firm_name) return next( new Error('franchisee Name is Required'));
    //if (!req.body.gst_number) return next( new Error('franchisee gst_number is Required'));
    //if (!req.body.drug_license) return next( new Error('franchisee drug_license is Required'));
    // if (!req.body.firm_phone) return next( new Error('franchisee phone is Required'));
    // if (!req.body.firm_email) return next( new Error('franchisee email is Required'));
    // if (!req.body.firm_address) return next( new Error('franchisee address is Required'));
    // if (!req.body.firm_state) return next( new Error('franchisee state is Required'));
    // if (!req.body.firm_district) return next( new Error('franchisee district is Required'));
    // if (!req.body.bank_name) req.body.bank_name =null;
    // if (!req.body.bank_ifsc) req.body.bank_ifsc =null;
    // if (!req.body.bank_acc_no) req.body.bank_acc_no =null;
    // if (!req.body.bank_payee_name) req.body.bank_payee_name =null;

    if (!req.body.name) return next( new Error('rep Name is Required'));
    if (!req.body.email) req.body.email = '';
    if (!req.body.phone) return next( new Error('rep phone is Required'));
    // if (!req.body.address) return next( new Error('rep address is Required'));
    // if (!req.body.dob) return next( new Error('rep dob is Required'));
    if (!req.body.password) return next( new Error('rep password is Required'));
    // if (!req.body.op_area) return next( new Error('rep Operation area is Required'));
    // if(!req.body.city) req.body.city = "";
    // if(!req.body.state) req.body.state = ""


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
        divisions: req.body.divisions? Array.isArray(req.body.divisions) ? (req.body.divisions).toString(): req.body.divisions : undefined
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
        op_area:req.body.op_area,
        is_owner :true,
    }
    try {
        // let repCheck = await repController.getRep({email:repData.email})
        // if(repCheck.length>0)
        //     return next( new Error('rep already exists!!!'));
        let franchisee = await franchiseeController.addFranchisee(franchiseeData)

        repData.franchisee_id = franchisee._id;
        let rep = await repController.addRep(repData)
        let result = [];
        result.push({franchiseeInfo:franchisee,repInfo:rep})
        req.data = result
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }




}

const getFranchisee = async(req,res,next)=>{
    if(!req.franchiseeId){
        req.status = 403;
        return next(new Error("Franchisee ID is required"))
    }
    
    try {
        let divisions = await franchiseeController.getFranchisee({id: req.franchiseeId})
        req.data = divisions
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

const updateFranchisee = async(req,res,next)=>{
    if(!req.is_owner){
        req.status = 403;
        return next(new Error("Not Authorized!!!"))
    }
    req.body.id = req.franchiseeId;
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

module.exports = {addFranchisee, RegisterRepandFranchisee, getFranchisee, updateFranchisee}