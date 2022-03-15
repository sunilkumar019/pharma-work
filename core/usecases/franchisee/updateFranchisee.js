//import model
const model = require("../../models/franchisee");
const getFranchisee = require("./getFranchisee");
//get division use case
const getDivision = require("../division/getDivisions")


//update a Franchisee 
module.exports = async (franchiseeId,data) => {
    let alldivisions = [];
    let selectedDivisions = [];
    if(!(Object.keys(data).length ==2 && Object.keys(data)[0] == "active" && Object.keys(data)[1] == "modified_on")){
        let DivisionRecords = await getDivision({});
        alldivisions = DivisionRecords.map(it => {return it._id})
        selectedDivisions = data.divisions;
        if(! Array.isArray(selectedDivisions)) selectedDivisions = data.divisions.split(",");
        delete data.divisions;
    }
    
    let updateResponse = await model.updateOne({ _id: franchiseeId }, { $set: data }).exec() 
    if(updateResponse.ok == 1){
        if(!(Object.keys(data).length ==2 && Object.keys(data)[0] == "active" && Object.keys(data)[1] == "modified_on")){

            let Res1 = await model.updateOne({ _id: franchiseeId }, { $pullAll: { divisions : alldivisions } }).exec()
            let final = await model.updateOne({ _id: franchiseeId }, { $push: { divisions:  selectedDivisions  } }).exec() 
            let fran =  await getFranchisee({_id:franchiseeId});
            return fran;
        }
        else{
            return "Franchisee Updated";
        }
   }
   else{
       return {Error: "Something went wrong!!!"}
   }
}