import { CPagination } from "@coreui/react";
import React from "react";
import { Col, Row } from "reactstrap";
import { GetProducts, GetProductsCount } from "src/api/products/allProducts/products";
import Model from '../../model/gallery/gallery'
import Page404 from "../page404/Page404";

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      classStyle: "",
      id: "",
      images: [],
      visualate: [],
      updated: false,
      isOpen : false, 
      imgUrl : false,
      alt : false
    };

    // Define inline styles
    this.styles = { backgroundColor: props.data.color || "#000", };
  }
  toggleImage() {
    this.setState({ classStyle: "grow" })
  }

  pageUpdated = id => {
    // this.state.updated

  }

  showModalImg = (imgUrl, alt) => { 
    this.setState({isOpen : true})
    this.setState({imgUrl  : imgUrl})
    this.setState({alt : alt})
      }

  // ***************************** Component Did Mount *******************************

  componentDidMount() {
    let img = []
    let vis = []
    if (this.props.data) {
      if (this.props.data.imgType === "IMG") {
        this.setState({ id: this.props.data.id })
        img.push({ type: this.props.data.imgType, url: this.props.data.img })
      }
      else if (this.props.data.imgType === "VIS") {
        this.setState({ id: this.props.data.id })
        vis.push({ type: this.props.data.imgType, url: this.props.data.img })
      }
    }
    this.setState({ images: img })
    this.setState({ visualate: vis })
  }



  render() {
    const { img, imgType, name, type, category, division, id } = this.props.data;

    return (
      <div>
        <div id="vueBind" className="container-gallery">
          <div v-for="data in content" className="card">
            {imgType === "IMG" ? <div className="ribbon-wrapper-green"><div className="ribbon-green">Image</div></div> :
              <div className="ribbon-wrapper-blue"><div className="ribbon-blue">Visualate</div></div>}
            <div className="imgBox">
              {
                imgType === "IMG" ?
                  <img onClick={() => this.setState({isOpen : true})} src={img} alt="Image" />
                  :
                  <img onClick={() => this.setState({isOpen : true})} src={img} alt="visulate" />
              }
            </div>
            <div className="content">
              <div className="contentBox">
                <h3>{name}<br />
                  <span>{type}</span><br />
                  <span>{category}</span><br />
                  <span>{division}</span>
                </h3>
              </div>
              <ul className="social">
              </ul>
            </div>
          </div>
          <div>
          </div>
        </div>
        <Row style={{ marginTop: "-70px", paddingLeft: "40px", paddingRight: "30px" }}>
          <Col xs="6">
            <Model
              buttonLabel="Attach"
              id={this.state.id}
              url={img}
              type={imgType}
              updated={this.props.updated}
            />

          </Col>
          <Col xs="6">
            <Model
              buttonLabel="Detach"
              id={id}
              images={img}
              name={name}
              updated={this.props.updated}
              type={imgType} />
          </Col>
        </Row>

        {this.state.isOpen === true ? (
              <div className="modalImg">
                <span className="closeImg" onClick={() => this.setState({isOpen : false})}>
                  &times;
                </span>
                
                {/* <img className="modal-contentImg" src={imgUrl} alt={alt} /> */}

                {
                imgType === "IMG" ?
                  <img src={img} alt="Image" className="modal-contentImg" />
                  :
                  <img src={img} alt="visulate"  className="modal-contentImg" />
              }

                <div className="captionImg">{imgType} - {name}</div>
              </div>
            )
              : <> </>
            }
      </div>
    );
  }
}

class CardGridView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      updated: false,
      loading: true,
      currentPage: 1,
      totalPage: 0,
      rowPerPage: 40,
    };
  }


  // ****************** Update Function *****************************

  updateState = (item) => {
    if (item === true) {
      this.setState({ updated: true })
    }
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



  // ****************** getData Function *****************************



  getData = async () => {

    this.setState({ loading: true })
    let skip = 0
    if (this.state.currentPage === 0) {
      skip = 1 * this.state.rowPerPage
    }

    else {
      skip = this.state.currentPage * this.state.rowPerPage
    }


    let skipVal = skip - this.state.rowPerPage
    let rs = await GetProducts({
      "limit": this.state.rowPerPage,
      "skip": skipVal
    })

    let rsCount = await GetProductsCount()
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

      let newData = [];

      rs.data.map((it) => {
        if (Array.isArray(it.images)) {
          it.images.map((img) => {
            newData.push({
              img: img.url,
              imgType: img.type,
              id: it.id,
              name: it.name,
              type: it.type_name,
              category: it.category_name,
              division: it.division_name,
            });
            return null
          });
        }
        return null
      });
      this.setState({ data: newData });
    }

    // let rs = await GetProducts(
    // );

    // let newData = [];
    // if (rs.success === true) {
    //   rs.data.map((it) => {
    //     if (Array.isArray(it.images)) {
    //       it.images.map((img) => {
    //         newData.push({
    //           img: img.url,
    //           imgType: img.type,
    //           id: it.id,
    //           name: it.name,
    //           type: it.type_name,
    //           category: it.category_name,
    //           division: it.division_name,
    //         });
    //         return null
    //       });
    //     }
    //     return null
    //   });
    //   this.setState({ data: newData });
    // }
    // else {
    // this.setState({ data: true });
    // }

    this.setState({ loading: false })

  }





  // ****************** componentDidMount Function *****************************



  async componentDidMount() {
    this.getData()

  }
  // ***************************** Component Did Update *******************************

  async componentDidUpdate() {
    // let rs = await GetProducts();
    if (this.state.updated === true) {
      // let updatedData = [];
      // if (rs.success === true) {
      //   rs.data.map((it) => {
      //     if (Array.isArray(it.images)) {
      //       it.images.map((img) => {
      //         updatedData.push({
      //           img: img.url,
      //           imgType: img.type,
      //           id: it.id,
      //           name: it.name,
      //           type: it.type_name,
      //           category: it.category_name,
      //           division: it.division_name,
      //           color: "#" + (((1 << 24) * Math.random()) | 0).toString(16),
      //         });
      //         return null
      //       });
      //     }
      //     return null
      //   });
      //   this.setState({ data: updatedData });
      this.getData()
      this.setState({ updated: false })
    }

  }

  render() {
    return (
      <>
        {this.state.loading ? <div className="loader"></div> :
          <div className="gallery_container" >
            {this.state.data.length === 0 ? <Page404 /> :
              <div className="card-grid-view row" >
                {this.state.data.map((cardData, index) => (
                  <Card updated={this.updateState} data={cardData} key={"card-id-" + index} />
                ))}
              </div>
            }
            <div className='page_margin'  >
              <CPagination
                className="pagination justify-content-center"
                activePage={this.state.currentPage}
                pages={this.state.totalPage}
                onActivePageChange={(e) => this.activePageChange(e)}
              ></CPagination>
            </div>
          </div>
        }
      </>
    );
  }
}

export default CardGridView;
