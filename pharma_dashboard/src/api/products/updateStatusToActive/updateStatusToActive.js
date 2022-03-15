import fetcher from "src/lib/fetcher";
import C from '../../../constants';

const URL = `${C.API_URL}/product/update/activeStatus`;

const updateStatusToActive = async ( data ) => {
    let rs = await fetcher({ method: "post", url: `${URL}` , data})
    return rs
}

export { updateStatusToActive };