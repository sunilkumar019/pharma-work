import fetcher from "src/lib/fetcher";
import C from '../../constants';

const URL = `${C.API_URL}/admin`;

const AdminLogin = async (data) => {
  let rs = await fetcher({ method: "post", url: `${URL}/login`, data })
  return rs
}

const AdminResetPassword = async (data) => {
  let d = { ...data }
  let rs = await fetcher({ method: "post", url: `${URL}/resetPassword`, data: d })
  return rs

}

export { AdminLogin, AdminResetPassword };