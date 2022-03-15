import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import ModalForm from "../../model/certificate/certificate";
import Table from "../../tables/certificate/certificate";
import { GetCertificate } from "src/api/certificate/certificate";
import Page404 from "../page404/Page404";

class State extends Component {
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
    this.setState({ updated: true });
  };

  // ****************** Update Function *****************************

  updateState = (item) => {
    this.setState({ updated: true });
  };

  // ****************** Delete Function *****************************

  deleteItemFromState = (id) => {
    this.setState({ updated: true });
  };

  // ****************** Get Data Function *****************************

  getData = async () => {
    let rs = await GetCertificate();
    if (rs.success === true) {
      this.setState({ items: rs.data });
      this.setState({ loading: false })
    }
  }


  // ****************** ComponentDidMount Function ********************

  async componentDidMount() {
    this.getData()
  }

  // ****************** componentDidUpdate Function ***********************

  async componentDidUpdate() {
    if (this.state.updated) {
      this.getData()
      this.setState({ updated: false })
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
                      <h5 className="h5_cstm"><b>Certificate Details</b></h5>
                    </div>
                    {this.state.items === true ? <> </> :
                      <div className="p-2">
                        <ModalForm
                          buttonLabel="Add Certificate"
                          addItemToState={this.addItemToState}
                        />
                      </div>
                    }
                  </div>
                </Col>
              </Row>
            </div>
            {
              this.state.items.length === 0 ? <Page404 /> :
                <Row>
                  <Col>
                    <Table
                      items={this.state.items}
                      updateState={this.updateState}
                      deleteItemFromState={this.deleteItemFromState}
                    />
                  </Col>
                </Row>
            }
          </Container>
        }
      </>
    );
  }
}

export default State;
