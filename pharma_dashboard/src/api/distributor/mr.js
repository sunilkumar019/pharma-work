import fetcher from "src/lib/fetcher";
import C from '../../constants';

const URL = `${C.API_URL}/rep`;

const GetMr = async (data) => {
  let d = { ...data }
  let rs = await fetcher({ method: "post", url: `${URL}/get`, data: d })
  return rs
}

export { GetMr }