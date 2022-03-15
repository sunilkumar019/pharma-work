//import model
const repModel = require("../../models/rep");
const franchiseeModel = require("../../models/franchisee");
const mongoose = require("mongoose");
const csv=require('csvtojson');
const fs = require('fs');

// ->csv to json return
async function  convertcsvtojson(filePath){
  
    filejson  =     await csv().fromFile(filePath)
    fs.unlinkSync(filePath);
    return filejson;
}

module.exports = async (productFile) => {
    fileJsonData = await convertcsvtojson('./core/uploads/reps/' + productFile);

    let errorData =[];
    let repData = [];
    let franchiseeData = [];
    for(let i=0;i<fileJsonData.length;i++)
    {   //tmp is i+2 because in excel rows start from 1
        let tmp = i+2;

        //rep info
        if(fileJsonData[i].name === undefined || fileJsonData[i].name == "")
            errorData.push("Rep Name Cannot be Empty. Error at Row NO: "+tmp)
        else
            repData[i].name = fileJsonData[i].Name;

        if(fileJsonData[i].email === undefined || fileJsonData[i].email == "")
            errorData.push("Rep Email Cannot be Empty. Error at Row NO: "+tmp)
        else if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(fileJsonData[i].email)))
            errorData.push("Rep Email Is not Valid. Error at Row NO: "+tmp)
        else
            repData[i].email = fileJsonData[i].email;

        if(fileJsonData[i].phone === undefined || fileJsonData[i].phone == "")
            errorData.push("Rep Phone Cannot be Empty. Error at Row NO: "+tmp)
        else
            repData[i].phone = fileJsonData[i].phone;
        
        if(fileJsonData[i].password === undefined || fileJsonData[i].password == "")
            errorData.push("Rep password Cannot be Empty. Error at Row NO: "+tmp)
        else
            repData[i].password = fileJsonData[i].password;

        if(fileJsonData[i].op_area != undefined || fileJsonData[i].op_area != "")
            repData[i].op_area = fileJsonData[i].op_area;

        if(fileJsonData[i].aadhar_no != undefined || fileJsonData[i].aadhar_no != "")
            repData[i].aadhar_no = fileJsonData[i].aadhar_no;

        if(fileJsonData[i].city != undefined || fileJsonData[i].city != "")
            repData[i].city = fileJsonData[i].city;

        if(fileJsonData[i].state != undefined || fileJsonData[i].state != "")
            repData[i].state = fileJsonData[i].state;
        
        if(fileJsonData[i].address != undefined || fileJsonData[i].address != "")
            repData[i].address = fileJsonData[i].address;

        //firm info
        if(fileJsonData[i].firm_name === undefined || fileJsonData[i].firm_name == "")
            errorData.push("Rep firm_name Cannot be Empty. Error at Row NO: "+tmp)
        else
            franchiseeData[i].firm_name = fileJsonData[i].firm_name;

        if(fileJsonData[i].gst_number != undefined || fileJsonData[i].gst_number != "")
            franchiseeData[i].gst_number = fileJsonData[i].gst_number;
        
        if(fileJsonData[i].drug_license != undefined || fileJsonData[i].drug_license != "")
            franchiseeData[i].drug_license = fileJsonData[i].drug_license;

        if(fileJsonData[i].firm_phone != undefined || fileJsonData[i].firm_phone != "")
            franchiseeData[i].firm_phone = fileJsonData[i].firm_phone;

        if(fileJsonData[i].firm_email != undefined || fileJsonData[i].firm_email != "")
            franchiseeData[i].firm_email = fileJsonData[i].firm_email;
            
        if(fileJsonData[i].firm_address != undefined || fileJsonData[i].firm_address != "")
            franchiseeData[i].firm_address = fileJsonData[i].firm_address;
            
        if(fileJsonData[i].firm_state != undefined || fileJsonData[i].firm_state != "")
            franchiseeData[i].firm_state = fileJsonData[i].firm_state;
            
        if(fileJsonData[i].firm_district != undefined || fileJsonData[i].firm_district != "")
            franchiseeData[i].firm_district = fileJsonData[i].firm_district;
            
        if(fileJsonData[i].bank_acc_no != undefined || fileJsonData[i].bank_acc_no != "")
            franchiseeData[i].bank_acc_no = fileJsonData[i].bank_acc_no;
            
        if(fileJsonData[i].bank_ifsc != undefined || fileJsonData[i].bank_ifsc != "")
            franchiseeData[i].bank_ifsc = fileJsonData[i].bank_ifsc;
            
        if(fileJsonData[i].bank_name != undefined || fileJsonData[i].bank_name != "")
            franchiseeData[i].bank_name = fileJsonData[i].bank_name;
            
        if(fileJsonData[i].bank_payee_name != undefined || fileJsonData[i].bank_payee_name != "")
            franchiseeData[i].bank_payee_name = fileJsonData[i].bank_payee_name;
    
    }

    if(errorData.length >0)
        return errorData;
    else
    {
        let insertionerror =[];
        for(let i=0;i<fileJsonData.length;i++)
        {
            customerSave = new customerModel({_id: new mongoose.Types.ObjectId()})
            customerSave.set(fileJsonData[i])
            customerSave.save(function(err,done){
                if(err) insertionerror.push(err)
            })
        }

        if(insertionerror.length>0)
            return insertionerror;
        else
            return {message: "Customers list uploaded"}
    }
}
