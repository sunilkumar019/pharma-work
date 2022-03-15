const model = require("../../models/admin");

module.exports = async (data) => {
    const updates = data.conditions;
    return await model
        .updateOne(
            { _id: data.adminId },
            updates
        ).exec();
}