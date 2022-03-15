const model = require("../../models/enquiry");

module.exports = async(filters) => {
        let data = Object.values(filters.data)[0]
        let field = Object.keys(filters.data)[0];

        const regex = new RegExp(escapeRegex(data), 'gi');
        return await model.find({ $or: [{
                [field]: regex }] }).exec()
    }

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

