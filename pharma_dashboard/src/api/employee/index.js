import fetcher from "src/lib/fetcher";
import C from '../../constants';

const URL = `${C.API_URL}/employee`;

const GetEmployee = async () => {
  let rs = await fetcher({ method: "post", url: `${URL}/get` })
  return rs
}

const AddEmployee = async (data) => {
  let d = { ...data };
  let rs = await fetcher({ method: "post", url: `${URL}/add`, data: d })
  return rs
}

const UpdateEmployee = async (data) => {
  let d = { ...data };
  let rs = await fetcher({ method: "post", url: `${URL}/update`, data: d })
  return rs;
}

const DeleteEmployee = async (id) => {
  let rs = await fetcher({ method: "get", url: `${URL}/delete/${id}` })
  return rs;
};


export { GetEmployee, AddEmployee, UpdateEmployee, DeleteEmployee };