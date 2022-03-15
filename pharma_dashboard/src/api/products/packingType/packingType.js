import fetcher from "src/lib/fetcher";
import C from '../../../constants';

const URL = `${C.API_URL}/product/packingType`;


const GetPackingType = async () => {
  let rs = await fetcher({ method: "post", url: `${URL}/get` })
  return rs
}

const AddPackingType = async (data) => {
  let d = { ...data };
  let rs = await fetcher({ method: "post", url: `${URL}/add`, data: d })
  return rs
}

const UpdatePackingType = async (data) => {
  let d = { ...data };
  let rs = await fetcher({ method: "post", url: `${URL}/update`, data: d })
  return rs
}

const DeletePackingType = async (id) => {
  let rs = await fetcher({ method: "get", url: `${URL}/delete/${id}` })
  return rs
};


export { GetPackingType, AddPackingType, UpdatePackingType, DeletePackingType };