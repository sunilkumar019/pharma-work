import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import { GetOrders } from "src/api/orders/orders";
import Table from "../../tables/order/order";
import Page404 from "../page404/Page404";
import Select from 'react-select'
import { GetDivisionType } from "src/api/products/divisionType/divisionType";


class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      divisionType: [], divisionTypeSelect: null,
      updated: false,
      loading: true
    };
  }

  // ****************** Delete Function *****************************

  deleteItemFromState = (id) => {
    this.setState({ updated: true })
    // const updatedItems = this.state.items.filter((item) => item.id !== id);
    // this.setState({ items: updatedItems });
  };

  // ****************** Get Data Function ***************************

  getData = async () => {

    this.setState({loading : true})
    let rs = await GetOrders();
    let rsDiv = await GetDivisionType()
    if (rs.success === true && rsDiv.success === true) {

      if (this.state.divisionTypeSelect !== null) {
        let orders = [];

        rs.data.forEach(list => {
          let products = [];
          (list.orderlist).forEach(it => {
            if (it.product.division_id == this.state.divisionTypeSelect.value) products.push(it);
          });

          if (products.length > 0) {
            orders.push({
              ...list,
              orderlist: [...products]
            })
          }
        });
        this.setState({ items: orders });
      }
      else {
        this.setState({ items: rs.data });
      }

      let divRes = []
      if (rsDiv.data.length > 0) {
        rsDiv.data.map((it) => {
          return divRes.push({ value: it.id, label: it.name })
        })
      }
      this.setState({ divisionType: divRes })
    }
    this.setState({ loading: false })

  }

  // ****************** handleChange Function ********************


  handleChange = (newValue, actionMeta) => {
    this.setState({ divisionTypeSelect: newValue })
    this.setState({ updated: true })
    // console.group('Value Changed');
    // console.log(newValue);
    // console.log(`action: ${actionMeta.action}`);
    // console.groupEnd();
  };


  // ****************** ComponentDidMount Function ********************

  async componentDidMount() {
    this.getData()
  }

  // ****************** componentDidUpdate Function ********************

  async componentDidUpdate() {
    if (this.state.updated) {
      this.getData()
      this.setState({ updated: false });
    }
  }


  // ************************ Render ******************************

  render() {
    return (
      <>
        {this.state.loading ? <div className="loader"></div> :
          <Container className="App">
            <div>
              <Row>
                <Col>
                  <div className="d-flex bg-light border">
                    <div className="p-2 flex-grow-1">
                      <h5 className="h5_cstm"><b>Orders Details</b></h5>
                    </div>
                    <div className="p-3" style={{ float: "right", width: "30%" }}>
                      <Select
                        value={this.state.divisionTypeSelect}
                        onChange={this.handleChange}
                        isClearable
                        // isSearchable
                        placeholder="Choose Divison"
                        options={this.state.divisionType} />

                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            <Row>
              <Col>
                {this.state.items?.length === 0 ? <Page404 /> :
                  <Table
                    items={this.state.items}
                    deleteItemFromState={this.deleteItemFromState}
                  />
                }
              </Col>
            </Row>
          </Container>}
      </>
    );
  }
}

export default Orders;
