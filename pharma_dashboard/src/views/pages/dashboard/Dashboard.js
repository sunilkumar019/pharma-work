import React, { lazy, useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CRow,
} from "@coreui/react";
import { GetAbout } from "src/api/about/about.js";
import bannerImg from "../../../assets/dashboard/banner.jpg";

const WidgetsDropdown = lazy(() => import("../../widgets/WidgetsDropdown.js"));

const Dashboard = () => {
  const [banner, setBanner] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyAPI() {
      let response = await GetAbout();
     

      if (
        response.success === true &&
        response.data != null &&
        response.data.about_img != null
      ) {
        setBanner(response.data.about_img);
      } else {
        setBanner(bannerImg);
      }
      setLoading(false);
    }

    fetchMyAPI();
  }, []);

  return (
    <>
      {loading ? (
        <div className="loader"></div>
      ) : (
        <>
          <WidgetsDropdown />
          <CCard>
            <CCardBody>
              <CRow>
                <img alt="banner" style={{ width: "100%" }} src={banner} />
              </CRow>
            </CCardBody>
          </CCard>
        </>
      )}
    </>
  );
};

export default Dashboard;
