import React from "react";
import Select from 'react-select';
import { Button, FormGroup, Label, Input, Row, Col, ModalFooter, Modal,  ModalBody } from "reactstrap";
import { NotificationManager } from "react-notifications";
import { AddProducts, UpdateProducts } from "src/api/products/allProducts/products";
import { GetPackingType } from "src/api/products/packingType/packingType";
import { GetType } from "src/api/products/productType/productType";
import { GetDivisionType } from "src/api/products/divisionType/divisionType";
import { GetCategoryType } from "src/api/products/category/category";
import { DetachPic } from "src/api/gallery/gallery";
import C from "src/constants";


class AddEditForm extends React.Component {
  state = {
    id: "",
    division_id: "",
    type_id: "",
    category_id: '',
    name: "",
    description: "",
    price: "",
    min_order_qty: "1",
    images: [],
    visualate: [],
    details: "",
    packing: "",
    packing_type: "",
    sku: "",
    hsn_code: "",
    new_launched: "false",
    upcoming: "false",
    visualImage: null,
    productImage: null,
    imagePreviewUrl: '',
    packageType: [], divisionType: [], category: [], type: [],
    packingTypeSelect: {}, divisionTypeSelect: {}, categorySelect: {}, typeSelect: {},
    file: null, image: null, base64: null,
    file2: null, image2: null, base642: null,
    imgUrls: [], visUrls: [], imgFile: [], visFile: [],
    valid: false, update: false,
    modal : false ,
    deleteId : "" , deleteType : "",
    packing_qty : 1
  };

  toggle = (id , type) => {
    console.log(id, type)
    this.setState(prevState => ({
      modal: !prevState.modal
    }));

    this.setState({deleteId : id});
    this.setState({deleteType : type});
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // -----------------------METADATA FUNCTION-----------------------------

  getFileMetadata = file => {
    return {
      lastModified: file.lastModified,
      name: file.name.replace(/\s/g, '_'),
      size: file.size,
      type: file.type,
      webkitRelativePath: file.webkitRelativePath
    }
  }

  // -----------------------ONCHANGE FUNCTION-----------------------------

  handleUploadImg = (e) => {
    this.setState({imgUrls: this.getAllSelectedImages(e)})
    };

  getAllSelectedImages = event => {
    let files = [];
    for(let i = 0; i < event.target.files.length; i++) {
      let tempFile = event.target.files[i];
      let file = this.fileSpaceRemover(tempFile)
      let url = URL.createObjectURL(file);
      let metadata = this.getFileMetadata(file)
      if(!this.isImageExistsInProduct(file, 'img').includes(true)) {
        files = [...files, {url, metadata, file}]
      }else if(!this.isImageExistsInProduct(file, 'vis').includes(true)) {
        files = [...files, {url, metadata, file}]
      } else {
        NotificationManager.info(`Duplicate Image [ ${file.name} ]`)
      }
    }
    return files;
  }

  isImageExistsInProduct = (file, type) => {
    let isExits = []
    if(this.props.item.images) {
      for (const { url } of this.props.item.images) {
        let index = url.lastIndexOf("/");
        isExits.push(url.substr(index-3) === `${type}/${file.name}`);
      }
    }
    return isExits;
  }

  fileSpaceRemover = tempFile => {
    let blob = tempFile.slice(0, tempFile.size, tempFile.type);
    return new File([blob], tempFile.name.replace(/\s/g, '_'), {type: tempFile.type});
  }

  handleUploadVis = (e) => {
    this.setState({visUrls: this.getAllSelectedImages(e)})
  };



  selectFormatter() {
    let pkgType = ""
    let divId = ""
    let catId = ""
    let typeId = ""

    if (this.state.packingTypeSelect && this.state.divisionTypeSelect && this.state.categorySelect
      && this.state.typeSelect) {
      pkgType = this.state.packingTypeSelect.label
      divId = this.state.divisionTypeSelect.value
      catId = this.state.categorySelect.value
      typeId = this.state.typeSelect.value
      this.setState({ packing_type: pkgType })
      this.setState({ division_id: divId })
      this.setState({ category_id: catId })
      this.setState({ type_id: typeId })
    }

    let imageItem = []
    let imgUrls = [this.state.imgUrls]
    if (imgUrls.length > 0) {
      imgUrls.map((it) =>
        it.map((item) =>
          imageItem.push(item.file)
        )
      )
    }

    let visItem = []
    let visUrls = [this.state.visUrls]
    if (visUrls.length > 0) {
      visUrls.map((it) =>
        it.map((item) =>
          visItem.push(item.file)
        )
      )
    }

    this.setState({ imgFile: imageItem })
    this.setState({ visFile: visItem })
  }

  // ****************** Add Function *****************************

  submitFormAdd = async (e) => {
    e.preventDefault();
    await this.selectFormatter()
    await this.validation();
    if (this.state.valid === true) {
      let new_launched = false
      let upcoming = false
      if (this.state.new_launched === "true") { new_launched = true }
      if (this.state.upcoming === "true") { upcoming = true }
      let rs = await AddProducts({
        name: this.state.name,
        description: this.state.description,
        price: parseInt(this.state.price),
        min_order_qty: parseInt(this.state.min_order_qty),
        details: this.state.details,
        packing: this.state.packing,
        type_id: this.state.type_id,
        category_id: this.state.category_id,
        packing_type: this.state.packing_type,
        division_id: this.state.division_id,
        sku: this.state.sku,
        hsn_code: this.state.hsn_code,
        images: this.state.imgFile,
        visualate: this.state.visFile,
        packing_qty: this.state.packing_qty,
        new_launched: new_launched,
        upcoming: upcoming
      });

      if (rs.success === true) {
        this.props.addItemToState(true);
        NotificationManager.info("Product Added Successfully", "Info", 2000);
      }
      else {
        NotificationManager.error(rs.message, "Info", 2000);
      }

      this.props.toggle();
    }
  };

  // ****************** Edit Function *****************************

  submitFormEdit = async (e) => {
    e.preventDefault();
    await this.selectFormatter()
    await this.validation();
    if (this.state.valid === true) {
      let new_launched = false
      let upcoming = false
      if (this.state.new_launched === "true") { new_launched = true }
      if (this.state.upcoming === "true") { upcoming = true }
      let rs = await UpdateProducts({
        id: this.state.id,
        name: this.state.name,
        description: this.state.description,
        price: parseInt(this.state.price),
        min_order_qty: parseInt(this.state.min_order_qty),
        details: this.state.details,
        packing: this.state.packing,
        type_id: this.state.type_id,
        category_id: this.state.category_id,
        packing_type: this.state.packing_type,
        division_id: this.state.division_id,
        sku: this.state.sku,
        packing_qty: this.state.packing_qty,
        hsn_code: this.state.hsn_code,
        images: this.state.imgFile,
        visualate: this.state.visFile,
        new_launched: new_launched,
        upcoming: upcoming,
      });

      if (rs.success === true) {
        this.props.updateState(true);
        NotificationManager.success("Product Updated Successfully", "Info", 2000);
      }
      else {
        NotificationManager.error(rs.message, "Error", 3000);
      }
      this.props.toggle();
    }
    return false
  };

  // ****************** Validation Function ***********************************

  validation = () => {
    if (!this.state.name || this.state.name.trim().length === 0) { return NotificationManager.error("Please Enter Name", "Info", 2000); }
    else if (!this.state.price) { return NotificationManager.error("Please Enter Price", "Info", 2000); }
    else if (!this.state.description || this.state.description.trim().length === 0) { return NotificationManager.error("Please Enter Composition", "Info", 2000); }
    else if (!this.state.packingTypeSelect || Object.keys(this.state.packingTypeSelect).length === 0) { return NotificationManager.error("Please Select Packing Type", "Info", 2000); }
    else if (!this.state.packing_qty && this.state.packing_qty === 0) { return NotificationManager.error("Please Enter Minimum Packing Quantit", "Info", 2000); }

    else if (!this.state.divisionTypeSelect || Object.keys(this.state.divisionTypeSelect).length === 0) { return NotificationManager.error("Please Select Division", "Info", 2000); }
    else if (!this.state.categorySelect || Object.keys(this.state.categorySelect).length === 0) { return NotificationManager.error("Please Select Category", "Info", 2000); }
    else if (!this.state.typeSelect || Object.keys(this.state.typeSelect).length === 0) { return NotificationManager.error("Please Select Product Type", "Info", 2000); }
    else if (!this.state.min_order_qty) { return NotificationManager.error("Please Enter Minimum Order Quantity", "Info", 2000); }
    else if (this.state.new_launched === "true" && this.state.upcoming === "true") {
      return NotificationManager.error("You can not make new Launch and Upcomming at same Time", "Info", 2000);
    }
    else { this.setState({ valid: true }); }
  };


  // ****************** Remove Function ***********************************

  removeimage = async (imgUrl, type) => {
    if (type === "Vis") {
      let rs = await DetachPic({
        id: this.state.id,
        url: (imgUrl).replace(`${C.SERVER_URL + '/'}`, ''),
        type: "VIS"
      })
      if (rs) {
        let newFileVis = []
        this.state.visUrls.map((it) => {
          if (it.url !== imgUrl) {
            newFileVis.push(it)
          }
          return newFileVis
        }

        )
        this.setState({ visUrls: newFileVis })
      }
      else {
        NotificationManager.error("Something Went Wrong", "Error", 2000);
      }
    }
    else {
      let rs = await DetachPic({
        id: this.state.id,
        url: (imgUrl).replace(`${C.SERVER_URL + '/'}`, ''),
        type: "IMG"
      })
      if (rs) {
        let newFile = []
        this.state.imgUrls.map((it) => {
          if (it.url !== imgUrl) {
            newFile.push(it)
          }
          return this.setState({ imgUrls: newFile })
        })
      }
      else {
        NotificationManager.error("Something Went Wrong", "Error", 2000);
      }
    }
    console.log(this.state.imgUrls)
    this.toggle()
  }

  // ********************** Get Data Function *************************************

  getData = async () => {

    let rsPackaging = await GetPackingType()
    let rsType = await GetType()
    let rsDivision = await GetDivisionType()
    let rsCategory = await GetCategoryType()

    if (rsPackaging.success === true && rsType.success === true && rsDivision.success === true && rsCategory.success === true) {
      this.setState({ packageType: rsPackaging.data })
      this.setState({ type: rsType.data })
      this.setState({ divisionType: rsDivision.data })
      this.setState({ category: rsCategory.data })
    }

    if (this.props.item) {
      const { id, name, description, price, min_order_qty, details, packing, sku, hsn_code , } = this.props.item;
      this.setState({ id, name, description, price, min_order_qty, details, packing, sku, hsn_code , });

      if (this.props.item.packing_qty !== null && this.props.item.packing_qty !== undefined) {
        this.setState({packing_qty : this.props.item.packing_qty })
      }

      if (this.props.item.new_launched === true) {
        this.setState({ new_launched: "true" })
      } else {
        this.setState({ new_launched: "false" })
      }

      if (this.props.item.upcoming === true) {
        this.setState({ upcoming: "true" })
      } else {
        this.setState({ upcoming: "false" })
      }

      if (this.props.item.images && Array.isArray(this.props.item.images)) {
        let selectedImg = []
        let selectedVis = []
        let imgMap = [this.props.item.images]
        imgMap.map((it) =>
          it.map((item) => {
            if (item.type === "IMG") {
              return selectedImg.push({ url: item.url })
            }
            else {
              return selectedVis.push({ url: item.url })
            }
          }))

        this.setState({ imgUrls: selectedImg })
        this.setState({ visUrls: selectedVis })
      }

      let packingTypeprops = {}
      let divisionTypeProps = {}
      let categoryTypeProps = {}
      let TypeProps = {}

      if (this.props.item.packing_type && Array.isArray(this.state.packageType)) {
        this.state.packageType.map((it) => {
          if (it.name === this.props.item.packing_type) {
            packingTypeprops = { value: it.id, label: it.name }
          }
          return true
        })
      }

      if (this.props.item.division_name && Array.isArray(this.state.divisionType)) {
        this.state.divisionType.map((it) => {
          if (it.name === this.props.item.division_name) {
            divisionTypeProps = { value: it.id, label: it.name }
          }
          return true
        })
      }

      if (this.props.item.category_name && Array.isArray(this.state.category)) {
        this.state.category.map((it) => {
          if (it.name === this.props.item.category_name) {
            categoryTypeProps = { value: it.id, label: it.name }
          }
          return true
        })
      }

      if (this.props.item.type_name && Array.isArray(this.state.type)) {
        this.state.type.map((it) => {
          if (it.name === this.props.item.type_name) {
            TypeProps = { value: it.id, label: it.name }
          }
          return true
        })
      }

      this.setState({ packingTypeSelect: packingTypeprops })
      this.setState({ divisionTypeSelect: divisionTypeProps })
      this.setState({ categorySelect: categoryTypeProps })
      this.setState({ typeSelect: TypeProps })
    }
  }

  // ******************* componentDidMount Function *****************************

   componentDidMount() {
    this.getData().then().catch(err => console.log(err))
  }

  // ******************* componentDidUpdate Function *****************************

  componentDidUpdate() {
    if (this.state.update === true) {
      this.getData().then().catch(err => console.log(err))
      this.setState({ update: false })
    }
  }


  render() {
    const btnStyle = { borderRadius: "300px" } 

    return (
      <>
        {/* _________________________________TEXT INPUT______________________________________ */}

        <Row form>
          <Col md={6}>
            <FormGroup>
              <Label>Name</Label>
              <Input type="text" name="name" id="name" onChange={this.onChange} value={this.state.name === null ? '' : this.state.name} />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>Composition</Label>
              <Input type="text" name="description" onChange={this.onChange} value={this.state.description === null ? '' : this.state.description} />
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col md={6}>
            <FormGroup>
              <Label>Price per unit</Label>
              <Input type="number" name="price" onChange={this.onChange} value={this.state.price === null ? '' : this.state.price} />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>Minimum Order</Label>
              <Input type="number" name="min_order_qty" onChange={this.onChange} value={this.state.min_order_qty === null ? '' : this.state.min_order_qty} />
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col md={6}>
            <FormGroup>
              <Label>Description</Label>
              <Input type="text" name="details" onChange={this.onChange} value={this.state.details === null ? '' : this.state.details} />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>Packing Dimension</Label>
              <Input type="text" name="packing" placeholder="eg : 10*10" onChange={this.onChange} value={this.state.packing === null ? '' : this.state.packing} />
            </FormGroup>
          </Col>
        </Row>

        {/* ___________________________________SELECT___________________________________ */}

        <Row form>
          <Col md={3}>
            <FormGroup>
              <Label style={{background : "#d7ffaa"}}>Packing Type</Label>
              <Select value={this.state.packingTypeSelect} onChange={(selectedOption) => this.setState({ packingTypeSelect: selectedOption })} options={this.state.packageType.map((item) => {
                return { value: item.id, label: item.name };
              })} />
            </FormGroup>
          </Col>

          <Col md={3}>
            <FormGroup>
              <Label style={{background : "#d7ffaa"}}>Packing Quantity</Label>
              <Input type="number" name="packing_qty" onChange={this.onChange} value={this.state.packing_qty === null && this.state.packing_qty === undefined ? 1 : this.state.packing_qty} />

            </FormGroup>
          </Col>

          <Col md={6}>
            <FormGroup>
              <Label>Division Type</Label>
              <Select value={this.state.divisionTypeSelect} onChange={(selectedOption) => this.setState({ divisionTypeSelect: selectedOption })} options={this.state.divisionType.map((item) => {
                return { value: item.id, label: item.name };
              })} />
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col md={6}>
            <FormGroup>
              <Label>Category</Label>
              <Select value={this.state.categorySelect} onChange={(selectedOption) => this.setState({ categorySelect: selectedOption })} options={this.state.category.map((item) => {
                return { value: item.id, label: item.name };
              })} />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>Product Type</Label>
              <Select value={this.state.typeSelect} onChange={(selectedOption) => this.setState({ typeSelect: selectedOption })} options={this.state.type.map((item) => {
                return { value: item.id, label: item.name };
              })} />
            </FormGroup>
          </Col>
        </Row>

        {/* _______________________________SKU & HNS Code__________________________________ */}

        <Row form>
          <Col md={6}>
            <FormGroup>
              <Label>Sku Code</Label>
              <Input type="text" name="sku" onChange={this.onChange} value={this.state.sku === null ? '' : this.state.sku} />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>Hsn Code</Label>
              <Input type="text" name="hsn_code" onChange={this.onChange} value={this.state.hsn_code === null ? '' : this.state.hsn_code} />
            </FormGroup>
          </Col>
        </Row>

        {/* ________________________________ New Launched _________________________________ */}

        <Row form style={{ marginTop: "20px" }}>
          <Col md={6}>
            <FormGroup>
              <div className="form-check form-check-inline">
                <span style={{ color: "#ff3f00" }}><b>New Launched</b></span>
                <input className="form-check-input" checked={this.state.new_launched === 'true'} style={{ marginLeft: "150px" }}
                  onChange={(e) => this.setState({ new_launched: e.target.value })} type="radio" name="inlineRadioOptions" id="inlineRadio1" value="true" />
                <label className="form-check-label" >Yes</label>
              </div>
              <div className="form-check form-check-inline" style={{ marginLeft: "150px" }}>
                <input className="form-check-input" checked={this.state.new_launched === 'false'} onChange={(e) => this.setState({ new_launched: e.target.value })} type="radio" name="inlineRadioOptions" id="inlineRadio2" value="false" />
                <label className="form-check-label" >No</label>
              </div>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <div className="form-check form-check-inline">
                <span style={{ color: "#ff0f0f" }}><b>Upcoming Product</b></span>
                <input className="form-check-input" checked={this.state.upcoming === 'true'} style={{ marginLeft: "150px" }}
                  onChange={(e) => this.setState({ upcoming: e.target.value })} type="radio" name="inlineRadioOptionsUpComing"
                  id="inlineRadioUpComing1" value="true" />
                <label className="form-check-label" >Yes</label>
              </div>
              <div className="form-check form-check-inline" style={{ marginLeft: "150px" }}>
                <input className="form-check-input" checked={this.state.upcoming === 'false'}
                  onChange={(e) => this.setState({ upcoming: e.target.value })} type="radio" name="inlineRadioOptionsUpComing"
                  id="inlineRadioUpComing2" value="false" />
                <label className="form-check-label" >No</label>
              </div>
            </FormGroup>
          </Col>
        </Row>

        {/* _______________________________________IMAGE_____________________________________ */}

        <Row form>
          <Col md={6}>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", marginTop: "20px" }}>
              {this.state.imgUrls.map(f => {
                return (
                  <>
                    {this.state.imgUrls.length < 50 ?
                      <div style={{ position: "relative" }}>
                        <button onClick={(e) => this.toggle(f.url)} className="close AClass">
                          <span>&times;</span>
                        </button>
                        <img src={f.url} alt='products' height="80" width="80" />
                      </div>
                      :
                      <img src={f.url} alt='products' height="30" width="30" />
                    }
                  </>
                );
              })}
            </div>
          </Col>

          <Col md={6}>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap",  marginTop: "20px" }}>
              {this.state.visUrls.map(f => {
                return (
                  <>
                    {this.state.visUrls.length < 50 ?
                      <div style={{ position: "relative" }}>
                        <button onClick={(e) => this.toggle(f.url, "Vis")} className="close AClass">
                          <span>&times;</span>
                        </button>
                        <img src={f.url} alt='products' height="80" width="80" />
                      </div>
                      :
                      <img src={f.url} alt='products' height="30" width="30" />
                    }
                  </>
                );
              })}
            </div>
          </Col>
        </Row>
        <Row form>
          <Col md={6}>
            <FormGroup>
              <Label>Select Product Image</Label>
              <Input type="file" accept="image/*" multiple onChange={this.handleUploadImg} />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>Select Visualate Image</Label>
              <Input type="file" accept="image/x-png,image/gif,image/jpeg" name="imageVisualate" multiple onChange={this.handleUploadVis} />
            </FormGroup>
          </Col>
        </Row>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalBody style={{ textAlign: "center" }}>
          <i style={{ fontSize: "65px", color: "red" }} className="fas fa-exclamation-triangle"></i> <br />
          <h4 style={{ paddingTop: "20px", fontWeight: "400" }}><b>Confirm Permanent Deletion</b></h4>   <br />
          <p>
            Are you sure you want to delete the selected item permanently?
            Once deleted permanently. they cannot be recovered
          </p>
          <button style={btnStyle}  onClick={() => this.removeimage(this.state.deleteId , this.state.deleteType )} className="delete_btn">Delete</button>
          <button style={btnStyle} onClick={this.toggle} className="cancel_btn">Cancel</button>
        </ModalBody>
      </Modal>
        <Button color="primary" onClick={this.props.item ? this.submitFormEdit : this.submitFormAdd} >Submit</Button>
      </>
    );
  }
}

export default AddEditForm