import React, { useEffect, useState } from 'react'
import {
  CWidgetDropdown,
  CRow,
  CCol,
} from '@coreui/react'
import { GetOfferCount } from 'src/api/offer/offer'
import { DistributorCount } from 'src/api/distributor/distributor'
import { GetProductsCount } from 'src/api/products/allProducts/products'
import { GetOrdersCount } from 'src/api/orders/orders'
import { useHistory } from "react-router-dom";
import { getVisitsByPeriod } from "src/api/dashboard/dashboard";

const WidgetsDropdown = () => {
  // render
  const history = useHistory();
  const [offerCount, setOfferCount] = useState(0)
  const [distributorsCount, setDistributorsCount] = useState(0)
  const [productCount, setProductCount] = useState(0)
  const [orderCount, setOrderCount] = useState(0)
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    async function fetchMyAPI() {
      let OfferCount = await GetOfferCount()
      let distributorCount = await DistributorCount()
      let productsCount = await GetProductsCount()
      let ordersCount = await GetOrdersCount()
      let visitsDate = await getVisitsByPeriod();

      setVisits([
        visitsDate.lastWeek[0]?.visits,
        visitsDate.lastMonth[0]?.visits,
        visitsDate.lastThreeMonths[0]?.visits,
      ]);


      if (OfferCount.success === true && distributorCount.success === true && productsCount.success === true && ordersCount.success === true) {
        setOfferCount(OfferCount.data.count)
        setDistributorsCount(distributorCount.data.count)
        setProductCount(productsCount.data.count)
        setOrderCount(ordersCount.data.count)

      }
      else {
        setOfferCount(0)
        setDistributorsCount(0)
        setProductCount(0)
        setOrderCount(0)
      }

    }

    fetchMyAPI()
  }, [])

  const visitsData = [
    {
        visit: visits[0] ? visits[0] : 0,
        label: "7 Days",
        color: "primary"
    },
    {
        visit: visits[1] ? visits[1] : 0,
        label: "30 Days",
        color: "danger"
    },
    {
        visit: visits[2] ? visits[2] : 0,
        label: "90 Days",
        color: "info"
    }
]


  return (
    <CRow>
      <CCol sm="6" lg="2">
        <CWidgetDropdown
          style={{ cursor: "pointer" }}
          onClick={() => history.push("/offer")}
          color="gradient-primary"
          header={String(offerCount)}
          text="Offers"
          footerSlot={<span>&nbsp;</span>}
        >
          <img
            alt="offers"
            src={process.env.PUBLIC_URL + "/images/icons/offers.png"}
          />
        </CWidgetDropdown>
      </CCol>

      <CCol sm="6" lg="2">
        <CWidgetDropdown
          style={{ cursor: "pointer" }}
          onClick={() => history.push("/distributor")}
          color="gradient-info"
          header={String(distributorsCount)}
          text="Distributors"
          footerSlot={<span>&nbsp;</span>}
        >
          <img
            style={{ maxWidth: "48px", height: "48px" }}
            alt="Distributors"
            src={process.env.PUBLIC_URL + "/images/icons/distributor.png"}
          />
        </CWidgetDropdown>
      </CCol>

      <CCol sm="6" lg="2">
        <CWidgetDropdown
          style={{ cursor: "pointer" }}
          onClick={() => history.push("/product")}
          color="gradient-warning"
          header={String(productCount)}
          text="Products"
          footerSlot={<span>&nbsp;</span>}
        >
          <img
            style={{ maxWidth: "48px", height: "48px" }}
            alt="products"
            src={process.env.PUBLIC_URL + "/images/icons/products.png"}
          />
        </CWidgetDropdown>
      </CCol>

      <CCol sm="6" lg="2">
        <CWidgetDropdown
          style={{ cursor: "pointer" }}
          onClick={() => history.push("/orders")}
          color="gradient-danger"
          header={String(orderCount)}
          text="Orders"
          footerSlot={<span>&nbsp;</span>}
        >
          <img
            style={{ maxWidth: "48px", height: "48px" }}
            alt="orders"
            src={process.env.PUBLIC_URL + "/images/icons/orders.png"}
          />
        </CWidgetDropdown>
      </CCol>

      <CCol sm="6" lg="4">
        <div style={{backgroundColor: "#143c55"}} className="text-white shadow-sm p-1 rounded font-weight-bold">
        <p className="text-center"> Visits </p>
          <div className="d-flex justify-content-around ">
            {visitsData.map((value) => {
              return (
                <div key={value.label} style={{backgroundColor: "#376ea5",marginTop: "-10px", lineHeight: 0.8, padding: "10px 10px 14px 10px", borderRadius: 5}}>
                  <p style={{fontSize: 12, fontWeight: "bolder", textDecoration: "underline"}} > {value.label}  </p>
                  <p style={{textAlign: "center", marginBottom: 0}} > <small> {value.visit} </small> </p>
                </div>
              );
            })}
          </div>
        </div>
      </CCol>
    </CRow>
  );
}

export default WidgetsDropdown
