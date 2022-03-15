import fetcher from "src/lib/fetcher";
import C from '../../constants';

const URL = `${C.API_URL}/admin`

const UserProfile = async () => {
  let rs = await fetcher({ method: "get", url: `${URL}/profile` })
  return rs
}

const UserInfoUpdate = async (data) => {
  var bodyFormData = new FormData();
  bodyFormData.append('name', data.name);
  bodyFormData.append('email', data.email);
  bodyFormData.append('phone', data.phone);
  bodyFormData.append('company', data.company);
  bodyFormData.append('profile_pic', data.profile_pic);

  let rs = await fetcher({ method: "post", url: `${URL}/update`, data: bodyFormData })
  return rs
}

const UserChangePassword = async (data) => {
  let d = { ...data }

  let rs = await fetcher({ method: "post", url: `${URL}/changePassword`, data: d })
  return rs
}



export { UserProfile, UserInfoUpdate, UserChangePassword };