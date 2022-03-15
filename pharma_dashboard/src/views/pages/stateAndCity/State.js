import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import ModalForm from "../../model/StateAndCity/state";
import Table from "../../tables/StateAndCity/state";
import { GetState } from "../../../api/stateAndCity/state";
import Page404 from "../page404/Page404";

class State extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      updated: false,
      loading : true
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

  // ****************** Get Data Function ********************

  getData = async() => {
    let rs = await GetState();
    if (rs.success === true) {
      let field='name';
      let sRs = rs.data.sort((a, b) => (a[field] || "").toString().localeCompare((b[field] || "").toString()))
      this.setState({ items: sRs });
      this.setState({loading :false})
      this.setState({updated : false})
    }
  }


  // ****************** ComponentDidMount Function ********************

  componentDidMount() {
    this.getData()
  }

  // ****************** componentDidUpdate Function ***********************

  componentDidUpdate() {
    if (this.state.updated) {
      this.setState({updated: false});
      this.getData()
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
                  <h5 className="h5_cstm"><b>State Details</b></h5>
                </div>
                {this.state.items === true ? <></> : 
                <div className="p-2">
                  <ModalForm
                    buttonLabel="Add State"
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

export default State;
