import fetcher from "src/lib/fetcher";
import C from '../../constants';

const URL = `${C.API_URL}/states`

const GetCity = async (id) => {
  let rs = await fetcher({ method: "get", url: `${URL}/${id}` })
  return rs
}

const AddCity = async (data) => {
  let d = { ...data };
  let rs = await fetcher({ method: "post", url: `${URL}/addCity`, data: d })
  return rs
}

const UpdateCity = async (data) => {
  let d = { ...data };
  let rs = await fetcher({ method: "post", url: `${URL}/updateCity`, data: d })
  return rs
}

const DeleteCity = async (id, d) => {
  let rs = await fetcher({ method: "post", url: `${URL}/deleteCity`, data: d })
  return rs;

};


export { GetCity, AddCity, UpdateCity, DeleteCity };