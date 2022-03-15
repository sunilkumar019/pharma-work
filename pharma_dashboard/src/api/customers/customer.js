import fetcher from "src/lib/fetcher";
import C from '../../constants';

const URL = `${C.API_URL}/customer`;
 
const GetCustomer = async (data) => {
  let d ={...data}
  let rs = await fetcher({ method: "post", url: `${URL}/get`, data: d })
  return rs
}

const SearchCustomer = async (data) => {
  let d ={...data}
  let rs = await fetcher({ method: "post", url: `${URL}/search`, data: d })
  return rs
}

const GetMr = async () => {
  let rs = await fetcher({ method: "post", url: `${URL}/get`, data: {"is_owner" : false} })
  return rs.data.data
}

const GetCustomerCount = async () => {
  let rs = await fetcher({ method: "get", url: `${URL}/count` })
  return rs
}


export  { GetCustomer , GetMr, GetCustomerCount, SearchCustomer};