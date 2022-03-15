import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import ModalForm from "../../model/distributor/distributorModel";
import Table from "../../tables/distributor/distributor";
import { DistributorCount, GetDistributor, SearchDistributor } from "src/api/distributor/distributor";
import { CPagination } from "@coreui/react";
import Page404 from "../page404/Page404";
import ImportFromCsv from "src/views/model/distributor/bulkUpload";

class Distributor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      update: false,
      currentPage: 1,
      totalPage: 0,
      rowPerPage: 10,
      loading: true,
      search: ""
    };
  }

  // ****************** onSearch Function *****************************

  onSearch = (e) => {
    this.setState({ search: e.target.value });
    if (this.state.search !== "") {
      this.setState({ update: true })
    }
  }

  // ****************** onClose Function *****************************

  onClose = () => {
    this.setState({ search: "" })
    this.setState({ update: true })
  }



  // ****************** Add Function *****************************

  addItemToState = (item) => {
    if (item) {
      this.setState({ update: true })
    }
  };

  // ****************** Update Function *****************************

  updateState = (item) => {
    if (item) {
      this.setState({ update: true })
    }
  };

  // ****************** Delete Function *****************************

  deleteItemFromState = (id) => {
    if (id) {
      this.setState({ update: true })
    }
  };

  // ****************** ActivePageChange Function *****************************

  activePageChange = (item) => {
    this.setState({ currentPage: item })
    this.setState({ update: true })
    window.scroll({
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
     });
  };

  // ****************** Get Data Function *****************************

  GetData = async () => {
    if (this.state.search !== "") {
      let rs = await SearchDistributor({
        "name": this.state.search,
        is_owner: true
      })
      if (rs.success === true) {
        this.setState({ items: rs.data });
      }
      this.setState({ loading: false });
      this.setState({ update: false })
    }
    else {
          this.setState({loading : true})

      let skip = 0
      if (this.state.currentPage === 0) {
        skip = 1 * this.state.rowPerPage
      }
      else {
        skip = this.state.currentPage * this.state.rowPerPage
      }

      let skipVal = skip - this.state.rowPerPage
      let rs = await GetDistributor({
        "limit": this.state.rowPerPage,
        "skip": skipVal,
        "is_owner": true
      })

      let rsCount = await DistributorCount()
      if (rs.success === true && rsCount.success === true) {
        let page = rsCount.data.count / this.state.rowPerPage
        let num = Number(page) === page && page % 1 !== 0;
        if (num === true) {
          var str = page.toString();
          var numarray = str.split('.');
          var a = parseInt(numarray)
          this.setState({ totalPage: a + 1 });
        }
        else {
          this.setState({ totalPage: page });
        }
        this.setState({ items: rs.data });
      }
    }
    this.setState({ loading: false });

  }

  // ****************** ComponentDidMount Function *****************************

  async componentDidMount() {
    if (this.props.location.name) {
      this.setState({ search: this.props.location.name })
      this.setState({ update: true })
    }
    else {
      this.GetData()
    }
  }

  // ****************** ComponentDidUpdate Function *****************************

  async componentDidUpdate() {
    if (this.state.update === true) {
      this.GetData()
      this.setState({ update: false })
    }
  }

  // **************
  componentWillUnmount() {
    this.setState({})
  }

  render() {
    return (
      <>
        {
          this.state.loading ? <div className="loader"></div> :
            <Container className="App">
              <div>
                <div className="d-flex bg-light border">
                  <div className="p-2 flex-grow-1">
                    <h5>
                      <b>Distributor Details</b>
                    </h5>
                  </div>
                    <div className="row">
                      <div className="col-12 col-md-6 ">
                        <ImportFromCsv
                          updateState={this.updateState}
                          buttonLabel="Upload Excel sheet" />
                      </div>

                      <div className="col-12 col-md-6 ">
                        <ModalForm
                          stateId={this.props.location.id}
                          buttonLabel="Add Distributor"
                          addItemToState={this.addItemToState}
                        />
                      </div>
                    </div>
                </div>
              </div>
                  <div className="p-2">
                    <fieldset className="field-container col-6 col-md-12">
                      <input type="text" value={this.state.search} onChange={(e) => this.onSearch(e)}
                        placeholder="Search..." className="field-search" />
                      <div className="icons-container">
                        <div className="icon-search" style={{ top: "0px", left: "0px" }}></div>
                        <div className="icon-close" style={{ top: "0px", left: "-5px" }} onClick={this.onClose}>
                          <div className="x-up"></div>
                          <div className="x-down"></div>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                  {this.state.items.length === 0 ? <Page404 /> :
                  <Row>
                    <Col>
                      <Table
                        loading={this.state.loading}
                        items={this.state.items}
                        updateState={this.updateState}
                        deleteItemFromState={this.deleteItemFromState}
                      />
                      {
                        this.state.search === "" ?
                          <div className={'mt-2'} >
                            <CPagination
                              className="pagination justify-content-start"
                              activePage={this.state.currentPage}
                              pages={this.state.totalPage}
                              onActivePageChange={(e) => this.activePageChange(e)}
                            ></CPagination>
                          </div>
                          :
                          <></>
                      }
                    </Col>
                  </Row>
              }
            </Container>
        }
      </>
    );
  }
}

export default Distributor;