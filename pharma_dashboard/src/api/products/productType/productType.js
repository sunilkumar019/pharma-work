import fetcher from "src/lib/fetcher";
import C from '../../../constants';

const URL = `${C.API_URL}/product/type`;

const GetType = async () => {
  let rs = await fetcher({ method: "post", url: `${URL}/get` })
  return rs
}

const AddType = async (data) => {
  let d = { ...data };
  let rs = await fetcher({ method: "post", url: `${URL}/add`, data: d })
  return rs
}

const UpdateType = async (data) => {
  let d = { ...data };
  let rs = await fetcher({ method: "post", url: `${URL}/update`, data: d })
  return rs
}

const DeleteType = async (id) => {
  let rs = await fetcher({ method: "get", url: `${URL}/delete/${id}` })
  return rs
};


export { GetType, AddType, UpdateType, DeleteType };