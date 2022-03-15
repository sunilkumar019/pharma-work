import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import { GetDivisionType } from "src/api/products/divisionType/divisionType";
import ModalForm from "../../../model/products/divisionType";
import Table from "../../../tables/products/divisionType";
import Page404 from "../../page404/Page404";

class Division extends Component {
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
    // this.setState((prevState) => ({
    //   items: [...prevState.items, item],
    // }));
  };

  // ****************** Update Function *****************************

  updateState = (item) => {
    this.setState({ updated: true });

    // const itemIndex = this.state.items.findIndex((data) => data.id === item.id);
    // this.setState({ updated: true });
    // const newArray = [
    //   ...this.state.items.slice(0, itemIndex),
    //   item,
    //   ...this.state.items.slice(itemIndex + 1),
    // ];
    // this.setState({ items: newArray });
  };

  // ****************** Delete Function *****************************

  deleteItemFromState = (id) => {
    this.setState({ updated: true });

    // const updatedItems = this.state.items.filter((item) => item.id !== id);
    // this.setState({ items: updatedItems });
  };

  // ****************** GetData Function ***************************

  getData = async () => {
    let rs = await GetDivisionType();
    if (rs.success === true) {
      this.setState({ items: rs.data });
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
      this.setState({updated: false});
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
                      <h5 className="h5_cstm"><b>Division Type</b></h5>
                    </div>
                    {this.state.items === true ? <></> :
                      <div className="p-2">
                        <ModalForm
                          buttonLabel="Add Division"
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

export default Division;
