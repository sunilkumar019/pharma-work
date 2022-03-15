import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";

import Table from "../../tables/distributor/mr";
import { GetMr } from "src/api/distributor/mr";
import { Redirect } from "react-router";

import Page404 from "../page404/Page404";
class Mr extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
    };
  }


  // ****************** Add Function *****************************

  addItemToState = (item) => {
    this.setState((prevState) => ({
      items: [...prevState.items, item],
    }));
  };

  // ****************** Update Function *****************************

  updateState = (item) => {
    const itemIndex = this.state.items.findIndex((data) => data.id === item.id);
    const newArray = [
      ...this.state.items.slice(0, itemIndex),
      item,
      ...this.state.items.slice(itemIndex + 1),
    ];
    this.setState({ items: newArray });
  };

  // ****************** Delete Function *****************************

  deleteItemFromState = (id) => {
    const updatedItems = this.state.items.filter((item) => item.id !== id);
    this.setState({ items: updatedItems });
  };

  async componentDidMount() {
    let rs = await GetMr({
      franchisee_id : this.props.location.franchisee_id,
      is_owner: false,
      limit: 50,
      skip: 0
    });
    if (rs.success === true) {
      this.setState({ items: rs.data });
    }
  }

  componentWillUnmount() {
    this.setState({})
  }

  render() {
    if (!this.props.location.franchisee_id) {
      return <Redirect to="/distributor" />;
    }
    return (
        <Container className="App">
            <div>
                <div className="d-flex bg-light border">
                    <div className="p-2 flex-grow-1">
                        <h5>
                            <b>Medical Representative Details</b>
                        </h5>
                    </div>
                </div>
            </div>
            <Row>
                <Col>
                {this.state.items.length !== 0 ?
                 <Table
                 items={this.state.items}
                 updateState={this.updateState}
                 deleteItemFromState={this.deleteItemFromState}
             /> :
             <Page404 />
              }
                </Col>
            </Row>
        </Container>
    );
  }
}

export default Mr;