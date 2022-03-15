import fetcher from "src/lib/fetcher";
import C from '../../constants';

const URL = `${C.API_URL}/certificate`;


const GetCertificate = async () => {
  let rs = await fetcher({ method: "post", url: URL })
  return rs
}

const AddCertificate = async (data) => {
  var bodyFormData = new FormData();
  bodyFormData.append('title', data.title);
  bodyFormData.append('description', data.description);
  bodyFormData.append('image', data.image);
  let rs = await fetcher({ method: "post", url: `${URL}/add`, data: bodyFormData, headers: { "Content-Type": "multipart/form-data" } })
  return rs
}

const UpdateCertificate = async (data) => {
  var bodyFormData = new FormData();
  bodyFormData.append('id', data.id);
  bodyFormData.append('title', data.title);
  bodyFormData.append('description', data.description);
  bodyFormData.append('image', data.image);
  let rs = await fetcher({ method: "post", url: `${URL}/update`, data: bodyFormData, headers: { "Content-Type": "multipart/form-data" }, })
  return rs
}

const DeleteCertificate = async (id) => {
  let rs = await fetcher({ method: "delete", url: `${URL}/${id}` })
  return rs
};


export { GetCertificate, AddCertificate, DeleteCertificate, UpdateCertificate };