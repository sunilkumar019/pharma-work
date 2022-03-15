import fetcher from "src/lib/fetcher";
import C from '../../constants';

const URL = `${C.API_URL}/reports`;

const getCustomVisits = async (data) => {
  return await fetcher({ method: "post", url: `${URL}/getcustomvisits`, data })
}

const getByName = async (name) => {
  return await fetcher({ method: "get", url: `${URL}/getbyname?name=${name}` })
}

const getDownloadableData = async (data) => {
  return await fetcher({ method: "post", url: `${URL}/download`, data})
}

const getAllDistributors = async () => {
  return await fetcher({ method: "get", url: `${URL}/getalldistributor`})
}

const getAllMrs = async (id) => {
  return await fetcher({method: "get", url: `${URL}/getallmrs?franchiseeId=${id}`})
}

export { getCustomVisits, getByName, getDownloadableData, getAllDistributors, getAllMrs};