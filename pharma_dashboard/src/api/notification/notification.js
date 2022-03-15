import fetcher from "src/lib/fetcher";
import C from '../../constants';

const URL = `${C.API_URL}/notification`;

const SendNotification = async (d) => {
  let data = { ...d };
  let rs = await fetcher({ method: 'post', url: URL, data: data })
  return rs
}

const newUrl = `${C.API_URL}/rep/get`; 

const NotifiGetMr = async () => {
  let data = { "is_owner": false }
  let rs = await fetcher({ method: 'post', url: newUrl, data: data })
  return rs
}

const NotifiGetDistributor = async () => {
  let data = { "is_owner": true }
  let rs = await fetcher({ method: 'post', url: newUrl, data: data })
  return rs
}

export { SendNotification, NotifiGetMr, NotifiGetDistributor };