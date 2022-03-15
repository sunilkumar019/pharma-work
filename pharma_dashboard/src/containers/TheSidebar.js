import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import logo from '../assets/images/profile.png'

// sidebar nav config
import navigation from "./_nav";
import { UserProfile } from "src/api/user/user";

const TheSidebar = () => {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.sidebarShow);
  const [logoImg, setlogoImg] = useState("")
  const [logotext, setlogotext] = useState("")

  useEffect(() => {
    async function fetchMyAPI() {
      let rs = await UserProfile()
      if (rs.success === true) {
        setlogotext(rs.data.company)
        if (rs.data.profile_pic !== null) {
          setlogoImg(rs.data.profile_pic)
        }
        else {
          setlogoImg(logo)
        }
      }
      else {
        setlogotext("Demo App")
      }
    }
    fetchMyAPI()
  }, [])


  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({ type: "set", sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none" to="/">
        {/* <CIcon
          className="c-sidebar-brand-full"
          src={logoImg}
          height={40}
        /> */}
        <p className="logo-text"><b>{logotext}</b></p>
        <CIcon
          className="c-sidebar-brand-minimized"
          name="sygnet"
          height={35}
        />
      </CSidebarBrand>
      <CSidebarNav>
        <CCreateElement
          items={navigation}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle,
          }}
        />
      </CSidebarNav>
    </CSidebar>
  );
};

export default React.memo(TheSidebar);
