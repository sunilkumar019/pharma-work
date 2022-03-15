/************Packing type controller functions *******************/
const add = require("../usecases/packing_type/add");
const remove = require("../usecases/packing_type/remove");
const update = require("../usecases/packing_type/update");
const get = require("../usecases/packing_type/get");

//Add Packing Type
exports.add = async(packingType) => {

    if (!packingType.name) throw new Error('Packing Type Name is Required');
    let newpackingType = {
        name: packingType.name
    }
    let savedpackingType = await add(newpackingType);
    delete savedpackingType.__v

    return savedpackingType;
}
//update Packing Type
exports.update = async(packingTypeProps) => {
    let filter = {}
    let packingTypeId = packingTypeProps.id;
    if (!packingTypeProps.id) throw new Error("Please provide Packing Type Id");
    if (!packingTypeProps.name) throw new Error("Please provide Packing Type Name that you want to change");

    filter.name = packingTypeProps.name;
    let packingTypeRecords = await update(packingTypeId, filter);
    packingTypeRecords = packingTypeRecords.map(it => {
        return {
            id: it._id,
            name: it.name
        }
    })
    return packingTypeRecords;
}
//get Packing Type
exports.get = async(packingTypeProps) => {
    let filter = {}
    if (packingTypeProps.id) filter._id = packingTypeProps.id;

    if (packingTypeProps.name) filter.name = packingTypeProps.name;

    let packingTypeRecords = await get(filter);

    packingTypeRecords = packingTypeRecords.map(it => {

        return {
            id: it._id,
            name: it.name
        }
    })
    return packingTypeRecords;
}
//delete Packing Type
exports.delete = async(packingTypeId) => {
    if (!packingTypeId) throw new Error("Please provide Packing Type Id");

    let packingTypeResponse = await remove(packingTypeId);
    return packingTypeResponse;

}
