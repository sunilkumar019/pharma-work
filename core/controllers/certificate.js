//import use cases
const addCertificate = require("../usecases/certificate/addCertificate");
const getCertificate = require("../usecases/certificate/getCertificate");
const updateCertificate = require("../usecases/certificate/updateCertificate");
const countCertificate = require("../usecases/certificate/countCertificate");
const deleteCertificate = require("../usecases/certificate/deleteCertificate");


//addCertificate
exports.addCertificate = async(Image, data) => {
    if (!data.title) throw new Error('Certificate title is Required');

    data.image = null;

    if (Image)
        data.image = Image.path;

    let newcertificate = {
        title: data.title,
        description: data.description,
        image: data.image,
        created_on: new Date(Date.now())
    }
    let savedcertificate = await addCertificate(newcertificate);

    delete savedcertificate.__v
    delete savedcertificate.created_on

    return savedcertificate;
}

//get certificates
exports.getCertificate = async(props) => {
    let filters = {};
    if(props.id) filters._id = props.id;
    let records = await getCertificate(filters);
    if(records.length == 0) return [];
    
    return records.map(it=>{
        return {
            id: (it._id).toString(),
            title: it.title,
            description: it.description,
            image: it.image? `${process.env.BASE_URL}/${it.image}` : null,
            created_on: it.created_on,
            modified_on: it.modified_on
        }
    });
}

//count certificates
exports.countCertificates = async() => {

    let count = await countCertificate();

    return { count };
}

//update certificates
exports.updateCertificate = async(Image, props) => {
    let certificateId = props.id;
    
    if (!props.id) throw new Error("Please provide Certificate Id");
    let filter = {}
    if (props.title) filter.title = props.title;
    if (props.description) filter.description = props.description;
    if (Image) filter.image = Image.path;
    
    let response = await updateCertificate(certificateId, filter);

    return response;
}

//delete certificate
exports.deleteCertificate = async(certificateId) => {
    if (!certificateId) throw new Error("Please provide Certificate Id");

    let Response = await deleteCertificate(certificateId);
    return Response;
}