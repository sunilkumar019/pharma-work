//import model
const customerModel = require("../../models/customer");
const mongoose = require("mongoose");
const csv = require('csvtojson');
const fs = require('fs');

// ->csv to json return
async function convertcsvtojson(filePath) {

    filejson = await csv().fromFile(filePath)
    fs.unlinkSync(filePath);
    return filejson;
}

// Product  bulk upload from csv
module.exports = async(productFile) => {

    customerJsonData = await convertcsvtojson('./core/uploads/temp/' + productFile);

    let errorData = []
    for (let i = 0; i < customerJsonData.length; i++) { //tmp is i+2 because in excel rows start from 1
        let tmp = i + 2;

        if (customerJsonData[i].Name === undefined || customerJsonData[i].Name == "")
            errorData.push("Customer Name Cannot be Empty. Error at Row NO: " + tmp)
        else
            customerJsonData[i].name = customerJsonData[i].Name;

        if (customerJsonData[i].Email === undefined || customerJsonData[i].Email == "")
            errorData.push("Customer Email Cannot be Empty. Error at Row NO: " + tmp)
        else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(customerJsonData[i].Email)))
            errorData.push("Customer Email Is not Valid. Error at Row NO: " + tmp)
        else
            customerJsonData[i].email = customerJsonData[i].Email;

        if (customerJsonData[i].Phone === undefined || customerJsonData[i].Phone == "")
            errorData.push("Customer Phone Cannot be Empty. Error at Row NO: " + tmp)
        else
            customerJsonData[i].phone = customerJsonData[i].Phone;

        if (customerJsonData[i].Address === undefined || customerJsonData[i].Address == "")
            errorData.push("Customer Address Cannot be Empty. Error at Row NO: " + tmp)
        else
            customerJsonData[i].address = customerJsonData[i].Address;

        if (customerJsonData[i].Profession === undefined || customerJsonData[i].Profession == "")
            errorData.push("Customer Profession Cannot be Empty. Error at Row NO: " + tmp)
        else
            customerJsonData[i].profession = customerJsonData[i].Profession;


        delete customerJsonData[i].Name;
        delete customerJsonData[i].Email;
        delete customerJsonData[i].Address
        delete customerJsonData[i].Phone
        delete customerJsonData[i].Profession
    }

    if (errorData.length > 0)
        return errorData;
    else {
        let insertionerror = [];
        for (let i = 0; i < customerJsonData.length; i++) {
            customerSave = new customerModel({ _id: new mongoose.Types.ObjectId() })
            customerSave.set(customerJsonData[i])
            customerSave.save(function(err, done) {
                if (err) insertionerror.push(err)
            })
        }

        if (insertionerror.length > 0)
            return insertionerror;
        else
            return { message: "Customers list uploaded" }
    }
}