import axios from 'axios'

const Constants  = {
    ApiUrl : "http://192.168.0.155:3014",
    URL : "http://localhost:3000/api/web",
    fetcher : axios,
    token :  localStorage.getItem('token')
}

export default Constants