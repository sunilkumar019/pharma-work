//import model
const model = require("../../models/product");

//get product  
module.exports = async(filters) => {
        //const regex = new RegExp(escapeRegex(filters.data), 'gi');
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
        let filter = {};
        if(filters.data){
            filter.$or = [
                { description: { $regex: filters.data, $options: 'i' } }, 
                { name: { $regex: filters.data, $options: 'i' } }
            ]
        }

        if(filters.division_id) filter.division_id = filters.division_id 

        return await model.find(filter).populate("division_id").populate("type_id").populate("category_id").exec()
    }
}
    //$or:[ {'_id':objId}, {'name':param}, {'nickname':param} ]
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//{ $text: { $search: filters,$caseSensitive:false, } }