import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import { GetProducts, GetProductsCount, SearchProducts } from "src/api/products/allProducts/products";
import ModalForm from "../../model/products/product"
import Table from "../../tables/products/product"
import UploadTechDetails from '../../model/products/UploadTecDetails'
import ImportFromCsv from "src/views/model/products/UploadList";
import UploadImgVis from "src/views/model/products/UploadImgVisulate";
import { CPagination } from "@coreui/react";
import Page404 from "../page404/Page404";
import Select from 'react-select'
import { GetDivisionType } from "src/api/products/divisionType/divisionType";
import { GetType } from "src/api/products/productType/productType";
import { GetCategoryType } from "src/api/products/category/category";


const options = [
  { value: 'Division', label: 'Division' },
  { value: 'Type', label: 'Type' },
  { value: 'Category', label: 'Category' },
  { value: 'newLaunch', label: 'New Launch' },
  { value: 'upComing', label: 'Coming Soon' }
]

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      updated: false,
      currentPage: 1,
      totalPage: 0,
      filter: options, filterSelected: null,
      divisionType: [], divisionTypeSelect: null,
      categoryType: [], categoryTypeSelect: null,
      type: [], typeSelect: null,
      rowPerPage: 20,
      loading: true,
      search: ""
    };
  }

  handleChangeDiv = (newValue) => {
    this.setState({ divisionTypeSelect: newValue })
    this.setState({ updated: true })
  };

  handleChangeType = (newValue) => {
    this.setState({ typeSelect: newValue })
    this.setState({ updated: true })
  };

  handleChangecategory = (newValue) => {
    this.setState({ categoryTypeSelect: newValue })
    this.setState({ updated: true })
  };

  handleChangeFilter = (newValue) => {
    this.setState({ filterSelected: newValue })
    this.setState({ updated: true })
  };


  // ****************** onSearch Function *****************************

  onSearch = (e) => {
    this.setState({ search: e.target.value });
    if (this.state.search !== "") {
      this.setState({ updated: true })
    }
  }

  // ****************** onClose Function *****************************

  onClose = () => {
    this.setState({ search: "" })
    this.setState({ updated: true })
  }

  // ****************** Add Function *****************************

  addItemToState = (item) => {
    this.setState({ updated: true });
    this.setState((prevState) => ({
      items: [...prevState.items, item],
    }));
  };


  // ****************** Update Function *****************************

  updateState = (item) => {
    if (item) {
      this.setState({ updated: true })
    }
  };

  // ****************** Delete Function *****************************

  deleteItemFromState = (id) => {
    const updatedItems = this.state.items.filter((item) => item.id !== id);
    this.setState({ items: updatedItems });
  };

  // ****************** ActivePageChange Function *****************************

  activePageChange = (item) => {
    this.setState({ currentPage: item })
    this.setState({ updated: true })
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  // ****************** Get Data Function *****************************

  GetData = async () => {
    let rsDiv = await GetDivisionType()
    let rsType = await GetType()
    let rsCategory = await GetCategoryType()


    if (rsDiv.success === true && rsType.success === true && rsCategory.success === true) {
      let divRes = []
      let typeRes = []
      let typeCategory = []

      if (rsDiv.data.length > 0) {
        rsDiv.data.map((it) => {
          return divRes.push({ value: it.id, label: it.name })
        })
      }

      if (rsType.data.length > 0) {
        rsType.data.map((it) => {
          return typeRes.push({ value: it.id, label: it.name })
        })
      }

      if (rsCategory.data.length > 0) {
        rsCategory.data.map((it) => {
          return typeCategory.push({ value: it.id, label: it.name })
        })
      }

      this.setState({ divisionType: divRes })
      this.setState({ type: typeRes })
      this.setState({ categoryType: typeCategory })
    }

    // if searching with filter 

    if (this.state.search !== "") {
      let resp = null;
      if (this.state.filterSelected !== null) {
        resp = await SearchProducts({
          "name": this.state.search
        })

        let data = []

        if (resp.success === true) {
          this.setState({ items: data });
          if (this.state.filterSelected !== null && this.state.filterSelected.value === "Division") {
            resp.data.map((item) => {
              if (item.division_id === this.state.divisionTypeSelect.value) {
                return data.push(item)
              }
            })
          }
          else if (this.state.filterSelected !== null && this.state.filterSelected.value === "upComing") {
            resp.data.map((item) => {
              if (item.upcoming === true) {
                return data.push(item)
              }
            })
          }
          else if (this.state.filterSelected !== null && this.state.filterSelected.value === "newLaunch") {
            resp.data.map((item) => {
              if (item.new_launched === true) {
                return data.push(item)
              }
            })
          }
          else if (this.state.filterSelected !== null && this.state.filterSelected.value === "Type") {
            resp.data.map((item) => {
              if (item.type_id === this.state.typeSelect.value) {
                return data.push(item)
              }
            })
          }
          else if (this.state.filterSelected !== null && this.state.filterSelected.value === "Category") {
            resp.data.map((item) => {
              if (item.category_id === this.state.categoryTypeSelect.value) {
                return data.push(item)
              }
            })
          }
          this.setState({ items: data });
        }
      }
      // if searching without filter

      else {
        let rs = await SearchProducts({
          "name": this.state.search
        })
        if (rs.success === true) {
          this.setState({ items: rs.data });
        }
      }


    }

    else {
      this.setState({ loading: true })
      let skip = 0
      if (this.state.currentPage === 0) {
        skip = 1 * this.state.rowPerPage
      }
      else {
        skip = this.state.currentPage * this.state.rowPerPage
      }
      let skipVal = skip - this.state.rowPerPage
      let rs = null;
      let rsCount = null;

      if (this.state.filterSelected !== null) {
        if (this.state.filterSelected.value === "upComing") {
          rs = await GetProducts({
            "upcoming": true,
            "limit": this.state.rowPerPage,
            "skip": skipVal
          })
          rsCount = { success : true ,data : { count : rs.data.length}}
        }
        if (this.state.filterSelected.value === "newLaunch") {
          rs = await GetProducts({
            "new_launched": true,
            "limit": this.state.rowPerPage,
            "skip": skipVal
          })
          rsCount = { success : true ,data : { count : rs.data.length}}
        }
        else if (this.state.filterSelected.value === "Division" && this.state.divisionTypeSelect !== null) {
          rs = await GetProducts({
            "division_id": this.state.divisionTypeSelect.value,
            "limit": this.state.rowPerPage,
            "skip": skipVal
          })
          rsCount = await GetProductsCount({ "division_id": this.state.divisionTypeSelect.value, })
        }
        else if (this.state.filterSelected.value === "Type" && this.state.typeSelect !== null) {

          rs = await GetProducts({
            "type_id": this.state.typeSelect.value,
            "limit": this.state.rowPerPage,
            "skip": skipVal
          })
          rsCount = await GetProductsCount({ "type_id": this.state.typeSelect.value, })
        }
        else if (this.state.filterSelected.value === "Category" && this.state.categoryTypeSelect !== null) {

          rs = await GetProducts({
            "category_id": this.state.categoryTypeSelect.value,
            "limit": this.state.rowPerPage,
            "skip": skipVal
          })
          rsCount = await GetProductsCount({ "category_id": this.state.categoryTypeSelect.value, })
        }
      }

      else {
        rs = await GetProducts({
          "limit": this.state.rowPerPage,
          "skip": skipVal
        })
        rsCount = await GetProductsCount()
      }

      if (rs !== null && rsCount !== null && rs.success === true && rsCount.success === true) {
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

  componentDidMount() {
    if (this.props.location.name) {
      this.setState({ search: this.props.location.name })
      this.setState({ updated: true })
    }
    else {
      this.GetData().then().catch(err => console.log(err))
    }
  }

  // ****************** ComponentDidUpdate Function *****************************

  componentDidUpdate() {
    if (this.state.updated === true) {
      this.GetData().then().catch(err => console.log(err))
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
                          <h5><b>Product Details</b></h5>
                        </div>
                        {this.state.items === true ? <></> :
                            <div className="row">
                              <div className="col-12 col-md-3">
                                <UploadImgVis
                                    updateState={this.updateState}
                                    buttonLabel="Upload Images/Visulate" />
                              </div>
                              <div className="col-12 col-md-3 ">
                                <UploadTechDetails
                                    updateState={this.updateState}
                                    buttonLabel="Upload Technical Details" />
                              </div>
                              <div className="col-12 col-md-3 ">
                                <ImportFromCsv buttonLabel="Import From Csv"
                                               updateState={this.updateState} />
                              </div>
                              <div className="col-12 col-md-3 ">
                                <ModalForm updateState={this.updateState} buttonLabel="Add Product"
                                           addItemToState={this.addItemToState} />
                              </div>
                            </div>
                        }
                      </div>
                    </Col>
                  </Row>
                </div>

                <Row style={{ marginTop: "20px" }}>


                  <Col xs="12" sm="6">
                    <fieldset className="field-container" style={{ marginBottom: "8px" }}>
                      <input type="text" value={this.state.search} onChange={(e) => this.onSearch(e)}
                             placeholder="Search..." className="field-search" />
                      <div className="icons-container">
                        <div className="icon-search"></div>
                        <div className="icon-close" onClick={this.onClose}>
                          <div className="x-up"></div>
                          <div className="x-down"></div>
                        </div>
                      </div>
                    </fieldset>
                  </Col>
                  <Col xs="12" sm="6">
                    <div style={{ float: "right", width: "50%" }}>
                      <Select
                          value={this.state.filterSelected}
                          onChange={this.handleChangeFilter}
                          isClearable
                          // isSearchable
                          placeholder="Choose Filter"
                          options={this.state.filter} />

                      {this.state.filterSelected !== null && this.state.filterSelected.value === "Division" ?
                          <div style={{ marginTop: "10px" }}>
                            <Select
                                value={this.state.divisionTypeSelect}
                                onChange={this.handleChangeDiv}
                                isClearable
                                // isSearchable
                                placeholder="Choose Divison"
                                options={this.state.divisionType} />
                          </div>
                          :
                          <>
                            {
                              this.state.filterSelected !== null && this.state.filterSelected.value === "Type" ?
                                  <div style={{ marginTop: "10px" }}>
                                    <Select
                                        value={this.state.typeSelect}
                                        onChange={this.handleChangeType}
                                        isClearable
                                        // isSearchable
                                        placeholder="Choose Type"
                                        options={this.state.type} />
                                  </div>
                                  :
                                  <>
                                    {this.state.filterSelected !== null && this.state.filterSelected.value === "Category" ?
                                        <div style={{ marginTop: "10px" }}>
                                          <Select
                                              value={this.state.categoryTypeSelect}
                                              onChange={this.handleChangecategory}
                                              isClearable
                                              // isSearchable
                                              placeholder="Choose Category"
                                              options={this.state.categoryType} />
                                        </div>
                                        :
                                        <></>
                                    }

                                  </>
                            }
                          </>
                      }
                    </div>
                  </Col>

                </Row>

                {
                  this.state.items.length === 0 ?
                      <Page404 />
                      :
                      <Row>
                        <Col>
                          <Table
                              loading={this.state.loading}
                              items={this.state.items}
                              updateState={this.updateState}
                              deleteItemFromState={this.deleteItemFromState}
                          />
                          {!this.state.search ?
                              <div className={'mt-2'} >
                                <CPagination
                                    // aria-label="Page navigation example"
                                    className="pagination justify-content-start"
                                    activePage={this.state.currentPage}
                                    pages={this.state.totalPage}
                                    onActivePageChange={(e) => this.activePageChange(e)}
                                >

                                </CPagination>
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

export default Products;