//import use cases
const addFranchisee = require("../usecases/franchisee/addFranchisee");
const getFranchisee = require("../usecases/franchisee/getFranchisee");
const updateFranchisee = require("../usecases/franchisee/updateFranchisee");
const deleteFranchisee = require("../usecases/franchisee/deleteFranchisee")
const countFranchisees = require("../usecases/franchisee/countFranchisee");
//get division use case
const getDivision = require("../usecases/division/getDivisions")

//company order controller
const company_orderCtrl = require("./company_order");
//order controller
const orderCtrl = require("./order");
//customer controller
const customerCtrl = require("./customer");
//rep controller
const repCtrl = require("./rep");


//import moment for date formatting
const moment = require("moment");

//Formatter
const Formatter = require("../Formatters/index")

//Add franchisee
exports.addFranchisee = async(franchisee) => {

    if (!franchisee.name) throw new Error('franchisee Name is Required');
    if (!franchisee.gst_number) franchisee.gst_number = "NA";
    if (!franchisee.drug_license) franchisee.drug_license = "NA";
    // if (!franchisee.phone) throw new Error('franchisee phone is Required');
    // if (!franchisee.email) throw new Error('franchisee email is Required');
    if (!franchisee.phone) franchisee.phone = "NA";
    if (!franchisee.email) franchisee.email = "NA";
    if (!franchisee.address) franchisee.address = "NA";
    if (!franchisee.state) franchisee.state = "NA";
    if (!franchisee.district) franchisee.district = "NA";
    if (!franchisee.bank_acc_no) franchisee.bank_acc_no = null;
    if (!franchisee.bank_ifsc) franchisee.bank_ifsc = null;
    if (!franchisee.bank_name) franchisee.bank_name = null;
    if (!franchisee.bank_payee_name) franchisee.bank_payee_name = null;
    if (!franchisee.divisions || franchisee.divisions.length == 0) {
        let DivisionRecords = await getDivision({});
        franchisee.divisions = DivisionRecords.map(it => { return it._id })
    } else {
        franchisee.divisions = (franchisee.divisions).split(",")
    }

    if (!franchisee.logo_url) franchisee.logo_url = null;
    if (!franchisee.active) franchisee.active = true;
    let newfranchisee = {
        name: franchisee.name,
        gst_number: franchisee.gst_number,
        drug_license: franchisee.drug_license,
        address: franchisee.address,
        email: franchisee.email,
        phone: franchisee.phone,
        state: franchisee.state,
        district: franchisee.district,
        divisions: franchisee.divisions,
        logo_url: franchisee.logo_url,
        bank_acc_no: franchisee.bank_acc_no,
        bank_ifsc: franchisee.bank_ifsc,
        bank_name: franchisee.bank_name,
        bank_payee_name: franchisee.bank_payee_name,
        active: franchisee.active,
        created_on: new Date(Date.now())
    }
    let savedfranchisee = await addFranchisee(newfranchisee);

    delete savedfranchisee.__v
    delete savedfranchisee.modified_on
    delete savedfranchisee.created_on

    return savedfranchisee;
}

//get franchisee
exports.getFranchisee = async(franchiseeprops) => {
    let filter = {}
    if (franchiseeprops.id) filter._id = franchiseeprops.id;
    // if (franchiseeprops.name) filter.name = franchiseeprops.name;
    // if(franchiseeprops.email) filter.email = franchiseeprops.email;
    // if(franchiseeprops.phone) filter.phone = franchiseeprops.phone;
    // if(franchiseeprops.gst_number) filter.gst_number = franchiseeprops.gst_number;
    // if(franchiseeprops.drug_license) filter.drug_license = franchiseeprops.drug_license;
    // if(franchiseeprops.state) filter.state = franchiseeprops.state;
    // if(franchiseeprops.active) filter.active = franchiseeprops.active;
    let franchiseeRecords = await getFranchisee(filter);

    if (franchiseeRecords.length == 1 && (franchiseeprops.id)) return Formatter.franchiseeFormatter(franchiseeRecords[0]);
    else {
        franchiseeRecords = franchiseeRecords.map(it => {
            return Formatter.franchiseeFormatter(it);
        })
    }
    return franchiseeRecords;
}

//update franchisee
exports.updateFranchisee = async(franchiseeprops) => {

    let franchiseeId = franchiseeprops.id;
    if (!franchiseeprops.id) throw new Error("Please provide franchisee Id");
    let filter = {}
    if (franchiseeprops.name) filter.name = franchiseeprops.name;
    if (franchiseeprops.address) filter.address = franchiseeprops.address;
    if (franchiseeprops.email || franchiseeprops.email === '') filter.email = franchiseeprops.email;
    if (franchiseeprops.gst_number) filter.gst_number = franchiseeprops.gst_number;
    if (franchiseeprops.drug_license) filter.drug_license = franchiseeprops.drug_license;
    if (franchiseeprops.state) filter.state = franchiseeprops.state;
    if (franchiseeprops.district) filter.district = franchiseeprops.district;
    if (franchiseeprops.phone) filter.phone = franchiseeprops.phone;
    if (franchiseeprops.phone) filter.phone = franchiseeprops.phone;
    if (franchiseeprops.active) filter.active = franchiseeprops.active;
    if (franchiseeprops.bank_acc_no) filter.bank_acc_no = franchiseeprops.bank_acc_no;
    if (franchiseeprops.bank_ifsc) filter.bank_ifsc = franchiseeprops.bank_ifsc;
    if (franchiseeprops.bank_name) filter.bank_name = franchiseeprops.bank_name;
    if (franchiseeprops.bank_payee_name) filter.bank_payee_name = franchiseeprops.bank_payee_name;
    if (franchiseeprops.logo_url) filter.logo_url = franchiseeprops.logo_url;
    if (!franchiseeprops.divisions || franchiseeprops.divisions.length == 0) {
        let DivisionRecords = await getDivision({});
        filter.divisions = DivisionRecords.map(it => { return it._id })
    } else filter.divisions = franchiseeprops.divisions;

    filter.modified_on = new Date(Date.now());

    let franchiseeRecords = await updateFranchisee(franchiseeId, filter);

    if (franchiseeRecords.length == 1) return Formatter.franchiseeFormatter(franchiseeRecords[0]);
    else {
        franchiseeRecords = franchiseeRecords.map(it => {
            return Formatter.franchiseeFormatter(it);
        })
    }
    return franchiseeRecords;
}

//delete franchisee
exports.deleteFranchisee = async(franchiseeId) => {
    if (!franchiseeId) throw new Error("Please provide franchisee Id");
    /////////////////////////////////////////////////////////////////
    let CompanyordersTemp = await company_orderCtrl.getOrder({ franchisee_id: franchiseeId });
    if (CompanyordersTemp.length != 0)
        throw new Error("Unable to Delete Franchisee, Because It is Linked with Some Company Order Detail(s)")

    let OrderTemp = await orderCtrl.getOrder({ franchisee_id: franchiseeId })
    if (OrderTemp.length != 0)
        throw new Error("Unable to Delete Franchisee, Because It is Linked with Some Customer Order Detail(s)")

    let CustomerTemp = await customerCtrl.getCustomer({ franchisee_id: franchiseeId })
    if (CustomerTemp.length != 0)
        throw new Error("Unable to Delete Franchisee, Because It is Linked with Some Customer Detail(s)")

    let RepTemp = await repCtrl.getRep({ franchisee_id: franchiseeId, is_owner: true })
    if (RepTemp.length != 0)
        throw new Error("Unable to Delete Franchisee, Because It is Linked with Some Distributor/Rep Detail(s)")
            /////////////////////////////////////////////////////////////////
    let franchiseeRecords = await deleteFranchisee(franchiseeId);

    if (franchiseeRecords.Error) throw new Error(franchiseeRecords.Error)
    else return franchiseeRecords.Message;
}

//deactivate franchisee
exports.deactivateFranchisee = async(franchiseeId) => {
    if (!franchiseeId) throw new Error("Please provide franchisee Id");
    let filter = {}
    filter.active = false;
    filter.modified_on = new Date(Date.now());
    let franchiseeRecords = await updateFranchisee(franchiseeId, filter);

    if (franchiseeRecords.Error) throw new Error(franchiseeRecords.Error)
    else return "Franchisee Deactivated";
}

exports.activateFranchisee = async(franchiseeId) => {

    if (!franchiseeId) throw new Error("Please provide franchisee Id");
    let filter = {}
    filter.active = true;
    filter.modified_on = new Date(Date.now());
    let franchiseeRecords = await updateFranchisee(franchiseeId, filter);

    if (franchiseeRecords.Error) throw new Error(franchiseeRecords.Error)
    else return "Franchisee Activated";
}

exports.countFranchisee = async(franchiseeId) => {

    return await countFranchisees();
}