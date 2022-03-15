import fetcher from "src/lib/fetcher";
import C from '../../constants';

const URL = `${C.API_URL}/dashboard`;

const getVisitsByPeriod = async () => {
  return await fetcher({ method: "get", url: `${URL}/getvisits`})
}

export { getVisitsByPeriod };