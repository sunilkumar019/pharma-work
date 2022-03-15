import axios from 'axios'
require("dotenv").config();

const fetcher = async (data) => {
    try {
        const token = localStorage.getItem('token');
        let RequestData = {
            method: data.method,
            url: `/api/web${data.url}`,
            data: data.data,
            headers: { "x-access-token": token }
        }

        let rs = await axios(RequestData).catch(function (error) {
            if (error.response) {
                if(error.response.statusText === "Unauthorized") {
                    localStorage.removeItem('token');
                    window.location.assign('/')
                }
                return  error.response.data
            } else if (error.request) {
                return error.request
            } else {
                return error.message
            }
        });
        if (rs.data) {
            rs = rs.data
            return rs;
        }
        else {
            return rs;
        }
    }
    catch (e) {
        return new Error(e.request.response.message);
    }
}


export default fetcher;