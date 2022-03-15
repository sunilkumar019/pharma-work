import React from "react";

// ***********************PAGES*********************************
const Dashboard = React.lazy(() => import("./views/pages/dashboard/Dashboard"));
const Distributor = React.lazy(() =>
  import("./views/pages/distributor/Distributor")
);
const Mr = React.lazy(() => import("./views/pages/distributor/mr"));

const Product = React.lazy(() => import("./views/pages/product/Product"));
const Type = React.lazy(() => import("./views/pages/product/types/Type"));
const Category = React.lazy(() =>
  import("./views/pages/product/category/Category")
);
const Division = React.lazy(() =>
  import("./views/pages/product/division/Division")
);
const PackingType = React.lazy(() =>
  import("./views/pages/product/packingType/PackingType")
);

const Orders = React.lazy(() => import("./views/pages/orders/Orders"));
const Customer = React.lazy(() => import("./views/pages/customer/Customer"));
const Notification = React.lazy(() =>
  import("./views/pages/notification/Notification")
);
const Gallery = React.lazy(() => import("./views/pages/gallery/Gallery"));
const Offer = React.lazy(() => import("./views/pages/offer/Offer"));
const Promotional = React.lazy(() =>
  import("./views/pages/promotional/Promotional")
);
const AboutUs = React.lazy(() => import("./views/pages/aboutUs/AboutUs"));
const Certificate = React.lazy(() =>
  import("./views/pages/certificate/Certificate")
);
const Enquiries = React.lazy(() => import("./views/pages/enquiries/Enquiries"));
const Download = React.lazy(() => import("./views/pages/download/Download"));
const State = React.lazy(() => import("./views/pages/stateAndCity/State"));
const City = React.lazy(() => import("./views/pages/stateAndCity/City"));
const Profile = React.lazy(() => import("./views/pages/user/profile"));
const Employee = React.lazy(() => import("./views/pages/employee"));
const Summary = React.lazy(() => import("./views/pages/reports/summary/Summary"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/profile", name: "user profile", component: Profile },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  {
    path: "/distributor",
    exact: true,
    name: "Distributor",
    component: Distributor,
  },
  { path: "/distributor/mr", name: "Medical Representative", component: Mr },
  { path: "/product", exact: true, name: "Product", component: Product },
  { path: "/product/type", name: "type", component: Type },
  { path: "/product/category", name: "Category", component: Category },
  { path: "/product/division", name: "Division", component: Division },
  { path: "/product/packing", name: "Packing", component: PackingType },
  { path: "/orders", name: "Orders", component: Orders },
  { path: "/customer", name: "Customer", component: Customer },
  { path: "/notification", name: "Notification", component: Notification },
  { path: "/gallery", name: "Gallery", component: Gallery },
  { path: "/offer", name: "Offer", component: Offer },
  { path: "/promotional", name: "Promotional", component: Promotional },
  { path: "/about", name: "AboutUs", component: AboutUs },
  { path: "/certificate", name: "Certificate", component: Certificate },
  { path: "/enquiries", name: "Enquiries", component: Enquiries },
  { path: "/download", name: "Download", component: Download },
  { path: "/state", exact: true, name: "State", component: State },
  { path: "/employee", exact: true, name: "Employee", component: Employee },
  { path: "/summary", exact: true, name: "Visits Summary", component: Summary },

  { path: "/state/city/:id", name: "City", component: City },
];

export default routes;
