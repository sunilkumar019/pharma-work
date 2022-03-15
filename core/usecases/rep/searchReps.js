//import model
const { filter } = require("lodash");
const model = require("../../models/rep");

//get product  
module.exports = async(filters) => {
        let filter = [];
        for(let i=0; i< Object.keys(filters).length; i++){
            let data = Object.values(filters)[i]
            let field = Object.keys(filters)[i];
            let regex;
            if( typeof data !== "boolean") regex = new RegExp(escapeRegex(data), 'gi');
            else regex = data;
            filter.push({ [field]: regex })
        }
        
        return await model.find({ $and: filter }).populate("franchisee_id").exec()
    }

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
