import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import ModalForm from "../../model/StateAndCity/city";
import Table from "../../tables/StateAndCity/city";
import { GetCity } from "src/api/stateAndCity/city";
import uuid from "react-uuid";
import { Redirect } from "react-router-dom";
import Page404 from "../page404/Page404";

class City extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stateId: this.props.location.id,
      items: [],
      updated: false,
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

  // ****************** ComponentDidMount Function ********************

  async componentDidMount() {
    let rs = await GetCity(this.state.stateId);
    if (rs.success === true) {
      let json = rs.data.map(function (value, key) {
        return {
          id: uuid(),
          name: value,
        };
      });
      this.setState({ items: json });
    }
  }

  // ****************** componentDidUpdate Function ***********************

  async componentDidUpdate() {
    if (this.state.updated) {
      let rs = await GetCity(this.state.stateId);
      if (rs.success === true) {
        let json = rs.data.map(function (value, key) {
          return {
            id: uuid(),
            name: value,
          };
        });
        this.setState({ items: json });
      }
      this.setState({ updated: false });
    }
  }

  render() {
    if (!this.state.stateId) {
      return <Redirect to="/state" />;
    }
    return (
      <Container className="App">
        <div>
          <Row>
            <Col>
              <div className="d-flex bg-light border">
                <div className="p-2 flex-grow-1">
                  <h5 className="h5_cstm">
                    <b>City Details</b>
                  </h5>
                </div>
                <div className="p-2">
                  <ModalForm
                    stateId={this.props.location.id}
                    buttonLabel="Add City"
                    addItemToState={this.addItemToState}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <Row>
          <Col>
          {this.state.items.length === 0 ? <Page404 /> : 
            <Table
              stateId={this.props.location.id}
              items={this.state.items}
              updateState={this.updateState}
              deleteItemFromState={this.deleteItemFromState}
            />
          }
          </Col>
        </Row>
      </Container>
    );
  }
}

export default City;
