import React from "react";
import PrivateRoutes from "./privateRoutes";
import PublicRoutes from "./publicRoutes";

function Routes() {
  let isUserLoggedIn = false;
  if (localStorage.getItem("token")) {
    isUserLoggedIn = true;
  }
  return isUserLoggedIn ? <PrivateRoutes /> : <PublicRoutes />;
}

export default Routes;
