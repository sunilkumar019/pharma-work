//import use cases
const addCustomer = require("../usecases/customer/addCustomer");
const bulkUpload = require("../usecases/customer/bulkUpload")
const deleteCustomer = require("../usecases/customer/deleteCustomer");
const getCustomer = require("../usecases/customer/getCustomers");
const updateCustomer = require("../usecases/customer/updateCustomer");
const countCustomer = require("../usecases/customer/countCustomer");
// formatter
const Formatter = require("../Formatters/index");
//import moment for date formatting
const moment = require("moment");
const searchCustomer = require("../usecases/customer/searchCustomer");

//Add Customer
exports.addCustomer = async(Customer) => {
    if (!Customer.name) throw new Error('Customer Name is Required');
    if (!Customer.phone) throw new Error('Customer phone is Required');
    if (!Customer.email) throw new Error('Customer email is Required');
    if (!Customer.address) throw new Error('Customer address is Required');
    if (!Customer.rep_id) throw new Error('Rep Id is Required');
    if (!Customer.franchisee_id) throw new Error('Franchisee Id is Required');
    if (!Customer.profession) throw new Error('Customer Profession is Required');
    if (!Customer.working_place) Customer.working_place = null;
    if (!Customer.dob) Customer.dob = null
    if (!Customer.wedding_anniversary) Customer.wedding_anniversary = null
    if (!Customer.city) Customer.city = "";
    if (!Customer.state) Customer.state = "";

    let newCustomer = {
        name: Customer.name,
        city: Customer.city,
        state: Customer.state,
        address: Customer.address,
        email: Customer.email,
        phone: Customer.phone,
        profession: Customer.profession,
        rep_id: Customer.rep_id,
        franchisee_id: Customer.franchisee_id,
        working_place: Customer.working_place,
        dob: Customer.dob === null ? null : Customer.dob,
        wedding_anniversary: Customer.wedding_anniversary === null ? null : Customer.wedding_anniversary,
        created_on: new Date(Date.now())
    }
    let savedCustomer = await addCustomer(newCustomer);

    delete savedCustomer.__v
    delete savedCustomer.created_on

    return savedCustomer;
}

exports.bulkUpload = async(customerList) => {
    let savedList = await bulkUpload(customerList);
    return savedList;
}

exports.countCustomer = async() => {
    let CustomerRecords = await countCustomer();

    return CustomerRecords;
}

exports.searchCustomer = async(searchFilter) => {
    if (!searchFilter.name) throw new Error('Name is Required');
    let filter = {}
    if (searchFilter) filter.data = searchFilter;
    let searchRecords = await searchCustomer(filter);

    
    if (!searchRecords) return null;

    searchRecords = searchRecords.map(it => {
        let repData = it.rep_id? Formatter.RepFormatter(it.rep_id): null;
        let franchiseeData = Formatter.franchiseeFormatter(it.franchisee_id)
        return {
            id: it._id,
            name: it.name,
            email: it.email,
            phone: it.phone,
            city: it.city,
            state: it.state,
            address: it.address,
            profession: it.profession,
            rep_id: repData,
            franchisee_id: franchiseeData,
            working_place: it.working_place,
            dob: it.dob === null ? null : moment(it.dob).format("YYYY/MM/DD"),
            wedding_anniversary: it.dob === null ? null : moment(it.wedding_anniversary).format("YYYY/MM/DD"),
            created_on: moment(it.created_on).format("LLL"),
        }
    })
   return searchRecords;
}


//get Customer
exports.getCustomer = async(Customerprops) => {
    let filter = {}
    filter.skip = 0;
    filter.limit = 1000;

    if (Customerprops.skip) filter.skip = Customerprops.skip;
    if (Customerprops.limit) filter.limit = Customerprops.limit;


    if (Customerprops.franchisee_id) filter.franchisee_id = Customerprops.franchisee_id;
    if (Customerprops.rep_id) filter.rep_id = Customerprops.rep_id;
    if (Customerprops.id) filter._id = Customerprops.id;
    if (Customerprops.name) filter.name = Customerprops.name;
    if (Customerprops.email) filter.email = Customerprops.email;
    if (Customerprops.city) filter.city = Customerprops.city;
    if (Customerprops.state) filter.state = Customerprops.state;
    if (Customerprops.phone) filter.phone = Customerprops.phone;
    filter.active = true;
    if (Customerprops.search) filter.search = Customerprops.search;

    let CustomerRecords = await getCustomer(filter);

    if (!CustomerRecords) return null;

    CustomerRecords = CustomerRecords.map(it => {

        let repData = it.rep_id? Formatter.RepFormatter(it.rep_id): null;
        let franchiseeData = Formatter.franchiseeFormatter(it.franchisee_id)
        return {
            id: it._id,
            name: it.name,
            email: it.email,
            phone: it.phone,
            city: it.city,
            state: it.state,
            address: it.address,
            profession: it.profession,
            rep_id: repData,
            franchisee_id: franchiseeData,
            working_place: it.working_place,
            dob: it.dob === null ? null : moment(it.dob).format("YYYY/MM/DD"),
            wedding_anniversary: it.dob === null ? null : moment(it.wedding_anniversary).format("YYYY/MM/DD"),
            created_on: moment(it.created_on).format("LLL"),
        }
    })
    return CustomerRecords;
}

//update Customer
exports.updateCustomer = async(Customerprops) => {
        //  if(!Customerprops.repIsOwner) throw new Error("Not Authorized!!!");

        let CustomerId = Customerprops.id;
        if (!Customerprops.id) throw new Error("Please provide Customer Id");
        let filter = {}
        if (Customerprops.name) filter.name = Customerprops.name;
        if (Customerprops.city) filter.city = Customerprops.city;
        if (Customerprops.state) filter.state = Customerprops.state;
        if (Customerprops.address) filter.address = Customerprops.address;
        if (Customerprops.email) filter.email = Customerprops.email;
        if (Customerprops.phone) filter.phone = Customerprops.phone;
        if (Customerprops.active) filter.active = Customerprops.active;
        if (Customerprops.profession) filter.profession = Customerprops.profession;
        if (Customerprops.rep_id) filter.rep_id = Customerprops.rep_id;
        if (Customerprops.franchisee_id) filter.franchisee_id = Customerprops.franchisee_id;
        if (Customerprops.dob) filter.dob = Customerprops.dob;
        if (Customerprops.wedding_anniversary) filter.wedding_anniversary = Customerprops.wedding_anniversary;
        if (Customerprops.working_place) filter.working_place = Customerprops.working_place;

        let CustomerRecords = await updateCustomer(CustomerId, filter);
        CustomerRecords = {
            id: CustomerRecords[0]._id,
            name: CustomerRecords[0].name,
            email: CustomerRecords[0].email,
            phone: CustomerRecords[0].phone,
            city: CustomerRecords[0].city,
            state: CustomerRecords[0].state,
            address: CustomerRecords[0].address,
            profession: CustomerRecords[0].profession,
            rep_id: CustomerRecords[0].rep_id,
            franchisee_id: CustomerRecords[0].franchisee_id,
            working_place: CustomerRecords[0].working_place,
            dob: CustomerRecords[0].dob === null ? null : moment(CustomerRecords[0].dob).format("YYYY/MM/DD"),
            wedding_anniversary: CustomerRecords[0].dob === null ? null : moment(CustomerRecords[0].wedding_anniversary).format("YYYY/MM/DD"),
            created_on: moment(CustomerRecords[0].created_on).format("LLL"),
        }
        return CustomerRecords;
    }
    //delete Customer
exports.deleteCustomer = async(CustomerId) => {
    if (!CustomerId) throw new Error("Please provide Customer Id");

    let CustomerResponse = await deleteCustomer(CustomerId);
    return CustomerResponse;
}