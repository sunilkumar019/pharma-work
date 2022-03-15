import fetcher from "src/lib/fetcher";
import C from '../../constants';

const URL = `${C.API_URL}/enquiry`;

const GetEnquiry = async (id) => {
    let rs = await fetcher({ method: "post", url: `${URL}/get` })
    return rs
}

const SearchEnquiry = async (data) => {
    let d = { ...data }
    let rs = await fetcher({ method: "post", url: `${URL}/search`, data: d })
    return rs
}

const DeleteEnquiry = async (id) => {
    let rs = await fetcher({ method: "delete", url: `${URL}/${id}` })
    return rs
}

export { GetEnquiry, DeleteEnquiry, SearchEnquiry };