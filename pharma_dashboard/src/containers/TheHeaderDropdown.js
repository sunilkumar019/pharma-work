import  { useEffect, useState } from 'react'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useHistory } from 'react-router';
// import Constants from 'src/secrets';
import { UserProfile } from 'src/api/user/user';
import User from '../assets/images/user.png'

const TheHeaderDropdown = () => {

  let history = useHistory();
  const [avatar, setAvatar] = useState("")

  const logout = () => {
    localStorage.removeItem("token")
    window.location.assign("/")
  }
  const profile = () => {
    history.push({pathname: "/profile"})
  }

  useEffect(() => {
    async function fetchMyAPI() {
        let rs = await UserProfile()
        if (rs.success === true && rs.data.profile_pic !== null){
          setAvatar(rs.data.profile_pic)
        }
        else{
          setAvatar(User)
        }
    }
    fetchMyAPI()
  }, [])


  return (
    <CDropdown
      inNav
      className="c-header-nav-items mx-2"
      direction="down"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <CImg
            style={{width : "40px", height : "40px"}}
            src={avatar}
            className="c-avatar-img"
            alt="user avatar"
          />
        </div>
      </CDropdownToggle>
      <CDropdownMenu  placement="bottom-end">
        <CDropdownItem className="drop_items" onClick={profile}>
          <CIcon name="cil-user" className="mfe-2" />Profile
        </CDropdownItem>
        <CDropdownItem divider />
        <CDropdownItem onClick={logout} className="drop_items">
          <CIcon name="cil-lock-locked" className="mfe-2" />
          Log Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdown
