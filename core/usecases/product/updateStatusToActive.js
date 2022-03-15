const model = require("../../models/product");

module.exports = async ({id, isActive}) => {
    return model.findByIdAndUpdate( id, { active: isActive });
}