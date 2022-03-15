import fetcher from "src/lib/fetcher";
import C from '../../constants';

const URL = `${C.API_URL}/promo`

const GetPromo = async () => {
  let rs = await fetcher({ method: "post", url: URL, })
  return rs
}

const AddPromo = async (data) => {
  var bodyFormData = new FormData();
  bodyFormData.append('title', data.title);
  bodyFormData.append('description', data.description);
  bodyFormData.append('image', data.image);
  let rs = await fetcher({ method: "post", url: `${URL}/add`, data: bodyFormData, headers: { "Content-Type": "multipart/form-data" } })
  return rs
}

const UpdatePromo = async (data) => {
  var bodyFormData = new FormData();
  bodyFormData.append('id', data.id);
  bodyFormData.append('title', data.title);
  bodyFormData.append('description', data.description);
  bodyFormData.append('image', data.image);
  let rs = await fetcher({ method: "post", url: `${URL}/update`, data: bodyFormData, headers: { "Content-Type": "multipart/form-data" } })
  return rs

}

const DeletePromo = async (id) => {
  let rs = await fetcher({ method: "delete", url: `${URL}/delete/${id}` })
  return rs

};


export { GetPromo, AddPromo, DeletePromo, UpdatePromo };