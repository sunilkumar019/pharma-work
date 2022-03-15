import fetcher from "src/lib/fetcher";
import C from '../../constants';

const URL = `${C.API_URL}/Offer`;

const GetOffer = async () => {
  let rs = await fetcher({ method: "post", url: `${URL}/get` })
  return rs
}

const GetOfferCount = async () => {
  let rs = await fetcher({ method: "get", url: `${URL}/count` })
  return rs
}

const AddOffer = async (data) => {
  var bodyFormData = new FormData();
  bodyFormData.append('title', data.title);
  bodyFormData.append('division', data.division);

  bodyFormData.append('description', data.description);
  if (data.image.length > 0) {
    data.image.forEach(it => bodyFormData.append('image', it))
  }
  bodyFormData.append('valid_upto', data.valid_upto);
  bodyFormData.append('reps', data.reps);

  let rs = await fetcher({ method: "post", url: `${URL}/add`, data: bodyFormData, headers: { "Content-Type": "multipart/form-data" } })
  return rs
}

const UpdateOffer = async (data) => {
  var bodyFormData = new FormData();
  bodyFormData.append('id', data.id);
  bodyFormData.append('title', data.title);
  bodyFormData.append('description', data.description);
  bodyFormData.append('division', data.division);
  
  if (data.image.length > 0) {
    data.image.forEach(it => bodyFormData.append('image', it))
  }
  bodyFormData.append('valid_upto', data.valid_upto);
  bodyFormData.append('reps', data.reps);
  let rs = await fetcher({ method: "post", url: `${URL}/update`, data: bodyFormData, headers: { "Content-Type": "multipart/form-data" } })
  return rs
}

const DeleteOffer = async (id) => {
  let rs = await fetcher({ method: "get", url: `${URL}/delete/${id}` })
  return rs
};


export { GetOffer, GetOfferCount, AddOffer, DeleteOffer, UpdateOffer };