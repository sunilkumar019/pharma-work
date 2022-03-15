import fetcher from "src/lib/fetcher";
import C from '../../../constants';

const URL = `${C.API_URL}/product/category`;

const GetCategoryType = async (id) => {
  let rs = await fetcher({ method: "post", url: `${URL}/get` })
  return rs
}

const AddCategoryType = async (data) => {
  let d = { ...data };
  let rs = await fetcher({ method: "post", url: `${URL}/add`, data: d })
  return rs
}

const UpdateCategoryType = async (data) => {
  let d = { ...data };
  let rs = await fetcher({ method: "post", url: `${URL}/update`, data: d })
  return rs;
}

const DeleteCategoryType = async (id) => {
  let rs = await fetcher({ method: "get", url: `${URL}/delete/${id}` })
  return rs;

};


export { GetCategoryType, AddCategoryType, UpdateCategoryType, DeleteCategoryType };