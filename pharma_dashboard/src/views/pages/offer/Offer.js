import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import { GetOffer } from "src/api/offer/offer";
import ModalForm from "../../model/offer/offer";
import Table from "../../tables/offer/offer";
import Page404 from "../page404/Page404";

class Offer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      updated: false,
      loading: true
    };
  }

  // ****************** Add Function *****************************

  addItemToState = (item) => {
    if (item) {
      this.setState({ updated: true })
    }
  };

  // ****************** Update Function *****************************

  updateState = (item) => {
    if (item) {
      this.setState({ updated: true })
    }
  };

  // ****************** Delete Function *****************************

  deleteItemFromState = (id) => {
    if (id) {
      this.setState({ updated: true })
    }
  };

  // ****************** Get Data Function *****************************

  getData = async () => {
    let rs = await GetOffer();
    if (rs.success === true) {
      let newRS = []
      rs.data.map((it) => (
        newRS.push({
          id: it.id,
          valid_upto: it.valid_upto,
          title: it.title,
          reps: it.reps,
          description: it.description,
          division: it.division,
          image: it.image.split(',')
          // images: it.images
        })
      ))
      this.setState({ items: newRS });
    }
    this.setState({ loading: false })
  }

  // ****************** ComponentDidMount Function ********************

  async componentDidMount() {
    this.getData()
  }

  // ****************** componentDidUpdate Function ***********************

  async componentDidUpdate() {
    if (this.state.updated) {
      this.getData()
      this.setState({ updated: false });
    }
  }

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
                      <h5 className="h5_cstm"><b>Offers</b></h5>
                    </div>
                    {this.state.items === true ? <></> :
                      <div className="p-2">
                        <ModalForm
                          buttonLabel="Add Offers"
                          addItemToState={this.addItemToState}
                        />
                      </div>
                    }
                  </div>
                </Col>
              </Row>
            </div>
            <Row>
              <Col>
                {this.state.items.length === 0 ? <Page404 /> :
                  <Table
                    items={this.state.items}
                    updateState={this.updateState}
                    deleteItemFromState={this.deleteItemFromState}
                  />
                }
              </Col>
            </Row>
          </Container>
        }
      </>
    );
  }
}

export default Offer;
