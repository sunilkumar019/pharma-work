import fetcher from "src/lib/fetcher";
import C from '../../../constants';

const URL = `${C.API_URL}/division`;


const GetDivisionType = async () => {
  let rs = await fetcher({ method: "post", url: `${URL}/get` })
  return rs
}

const AddDivisionType = async (data) => {
  let d = { ...data };
  let rs = await fetcher({ method: "post", url: `${URL}/add`, data: d })
  return rs
}

const UpdateDivisionType = async (data) => {
  let d = { ...data };
  let rs = await fetcher({ method: "post", url: `${URL}/update`, data: d })
  return rs;
}

const DeleteDivisionType = async (id) => {
  let rs = await fetcher({ method: "get", url: `${URL}/delete/${id}` })
  return rs;
};


export { GetDivisionType, AddDivisionType, UpdateDivisionType, DeleteDivisionType };