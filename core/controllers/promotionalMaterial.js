//import use cases
const add = require("../usecases/promotional_material/add")
const remove = require("../usecases/promotional_material/remove")
const get = require("../usecases/promotional_material/get")
const update = require("../usecases/promotional_material/update");
const formatter = require("../Formatters")

//import moment for date formatting
const moment = require("moment");

exports.add = async (data)=>{

    if (!data.title) throw new Error('Title is Required');
    
    if(!data.description) data.description = null;

    if(!data.image) data.image = null;

    let newdata = {
        title: data.title,
        description: data.description,
        image: data.image,
        created_on: new Date(Date.now())
    }
    let savedData = await add(newdata);
    return formatter.PromotionaMaterialFormatter(savedData);
}


exports.get = async(data)=>{
    let filter ={}
    if (data.id) filter._id = data.id;

    if (data.title) filter.title = data.title;
    
    let Records = await get(filter);

    Records = Records.map(it => formatter.PromotionaMaterialFormatter(it))
    
    return Records;
}

exports.update = async(props)=>{
    let Id = props.id;
    if(!props.id) throw new Error("Please provide Material Id");
    let filter = {}
    if(props.title) filter.title = props.title;
    if(props.description) filter.description = props.description;
    if(props.image) filter.image = props.image;
    filter.modified_on = new Date(Date.now());
    let Records = await update(Id,filter);
    return Records;
}

exports.remove = async(Id)=>{
    if(!Id) throw new Error("Please provide Material Id");

    let Response = await remove(Id);
    return Response;
}