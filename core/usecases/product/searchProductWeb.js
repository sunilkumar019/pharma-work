//import model
const model = require("../../models/product");

//get product  
module.exports = async(filters) => {
    let resp = []

    if (filters.data.new_launched && filters.data.new_launched === true) {
        resp = await model.find({ new_launched : true }).populate("division_id").populate("type_id").populate("category_id").exec()
        return resp
    }

    else if (filters.data.upcoming && filters.data.upcoming === true) {
        resp = await model.find({ upcoming : true }).populate("division_id").populate("type_id").populate("category_id").exec()
        return resp
    }

    else {
        let data = Object.values(filters.data)[0]
        let field = Object.keys(filters.data)[0];
        const regex = new RegExp(escapeRegex(data), 'gi');
        resp = await model.find({
            $and: [{
                [field]: regex
            }, {$or: [{deleted: {$eq: 0}}, {active: {$eq: true}}]}]
        }).populate("division_id").populate("type_id").populate("category_id").exec()
        return resp
    }




}
//$or:[ {'_id':objId}, {'name':param}, {'nickname':param} ]
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//{ $text: { $search: filters,$caseSensitive:false, } }