//import use cases
const getStates = require("../usecases/stateCity/getStates")
const getCities = require("../usecases/stateCity/getCities")
const updateState = require("../usecases/stateCity/updateState")
const addState = require("../usecases/stateCity/addState")
const deleteState = require("../usecases/stateCity/deleteState")
const addCity = require("../usecases/stateCity/addCity")
const updateCity = require("../usecases/stateCity/updateCity")
const deleteCity = require("../usecases/stateCity/deleteCity")
//import moment for date formatting
const moment = require("moment");

const fs = require("../lib/FileStream");

const mongoose = require("mongoose");

//get states
exports.getStates = async()=>{
    
    let StatesNames = await getStates();
       StatesNames = StatesNames.map(it => {
        
        return {
            id:it._id,
            name: it.name
            }
        })
    return StatesNames;
}

//get cities
exports.getCities = async(stateId)=>{
    if(!mongoose.Types.ObjectId.isValid(stateId) ) {
        const err = new Error('valid State Id is Required');
        err.stack = null
        throw err
    }
    let CitiesNames = await getCities(stateId);

        CitiesNames = CitiesNames.cities.map(it => {
            return it
        })
    return CitiesNames;
}


exports.bulkAddStateCities =  () => {

    getStates().then(function(check){
        if(check.length ==0){
            let data = fs.dataOfStateCitiesFile();
            let done = true;
            for(let i=0; i< data.length; i++){
                let singledata = data[i];
                let dataToAdd = {name: data[i].name, cities: data[i].cities};
                addState(dataToAdd).then(function (cb) {
                    done = true;
                }).catch(function(e){ done = false;})
            }

            if(done)  console.log("state cities imported successfully")
            else console.log("Error while inserting state cities collection")
        }
    }).catch(function(e){ console.log("Error in State_cities file",e)})

}


//Add state
exports.addState = async (state)=>{
    if (!state.name) throw new Error('state Name is Required');
    
    let newstate = {
        name: state.name
    }
    let savedstate = await addState(newstate);

    // delete savedstate.__v
    // savedstate.id = savedstate._id;
    // delete savedstate._id;

    return savedstate;
}

//update state
exports.updateState = async(stateprops)=>{
    let stateId = stateprops.id;
    if(!stateprops.id) throw new Error("Please provide State Id");
    let filter = {}
    if(!stateprops.name) throw new Error("Please provide State Name");
    filter.name = stateprops.name;
    let stateNames = await updateState(stateId,filter);
    stateNames = stateNames.map(it => {
        return {
            id:it._id,
            name: it.name
            }
     })
     return stateNames;
}
//delete division
exports.deleteState = async(stateId)=>{
    if(!stateId) throw new Error("Please provide State Id");

    let StateResponse = await deleteState(stateId);
    return StateResponse;
}

//add new city
exports.addCity = async(cityprops) =>{
    if(!cityprops.stateId) throw new Error("State Id is Required");
    if(!cityprops.name) throw new Error("City Name is Required");

    let cityResponse = await addCity(cityprops.stateId,cityprops.name);
    return cityResponse
}
//update city 
exports.updateCity = async(cityprops) =>{
    if(!cityprops.stateId) throw new Error("State Id is Required");
    if(!cityprops.name) throw new Error("City Name is Required");
    if(!cityprops.oldName) throw new Error("City oldName is Required");

    let cityResponse = await updateCity(cityprops.stateId,cityprops.name,cityprops.oldName);
    return cityResponse
}
//delete city
exports.deleteCity = async(cityprops) =>{
    if(!cityprops.stateId) throw new Error("State Id is Required");
    if(!cityprops.cityName) throw new Error("City Name is Required");

    let cityResponse = await deleteCity(cityprops.stateId,cityprops.cityName);
    return cityResponse
}
