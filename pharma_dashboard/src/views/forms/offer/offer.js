import React from "react";
import {FormGroup, Label, Input, Col, Row } from "reactstrap";
import { NotificationManager } from "react-notifications";
import { AddOffer, UpdateOffer } from "src/api/offer/offer";
import { GetDistributor } from "src/api/distributor/distributor";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import moment from "moment";
import { GetDivisionType } from "src/api/products/divisionType/divisionType";
const animatedComponents = makeAnimated();

class AddEditForm extends React.Component {
  state = {
    id: "",
    title: "",
    description: "",
    valid_upto: "",
    distributor: [], distributorSelected: [], distributorList: [],
    division:[], divisionSelected: [], divisionList : [],
    file: null, image: null, base64: null, objectUrl: null,
    imgUrls: [], imgFile: []
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // ***************** IMAGE FUNCTION ****************************

  removeimage = (imgUrl) => {
    let selectedImages = [];
    let IMAGES = this.state.imgUrls
    for (let i = 0; i < IMAGES.length; i++) {
      let fileUrl = IMAGES[i].url;
      let fileObj = IMAGES[i]
      if (fileUrl !== imgUrl) {
        selectedImages.push({ url: fileUrl, file: fileObj.file })
      }
    }
    this.setState({ imgUrls: selectedImages })
  }

  // -----------------------METADATA FUNCTION-----------------------------

  getFileMetadata = file => {
    return {
      lastModified: file.lastModified,
      name: file.name,
      size: file.size,
      type: file.type,
      webkitRelativePath: file.webkitRelativePath
    }
  }

  // -----------------------ONCHANGE FUNCTION-----------------------------

  handleUploadImg = (e) => {
    let newstate = [];
    let selectedImages = [];
    for (let i = 0; i < e.target.files.length; i++) {
      let file = e.target.files[i];
      let url = URL.createObjectURL(file);
      selectedImages.push(file);
      let metadata = this.getFileMetadata(file);
      newstate = [...newstate, { url, metadata, file, type: "upload" }];
    }
    this.setState({ imgUrls: newstate })
  };

  // ****************** Add Function *****************************

  submitFormAdd = async (e) => {
    e.preventDefault();
    await this.DataFormatter()
    await this.validation();
    if (this.state.valid === true) {
      let rs = await AddOffer({
        title: this.state.title,
        description: this.state.description,
        distributor: this.state.distributorSelected,
        image: this.state.imgFile,
        valid_upto: this.state.valid_upto,
        reps: this.state.distributorSelected,
        division : this.state.divisionSelected

      });
      if (rs.success === true) {
        this.props.addItemToState(true);
        NotificationManager.info("Added Successfully", "Info", 2000);
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
    await this.DataFormatter()
    await this.validation();
    if (this.state.valid === true) {
      let rs = await UpdateOffer({
        id: this.state.id,
        title: this.state.title,
        description: this.state.description,
        distributor: this.state.distributorSelected,
        image: this.state.imgFile,
        valid_upto: this.state.valid_upto,
        reps: this.state.distributorSelected,
        division : this.state.divisionSelected
      });
      if (rs.success === true) {
        this.props.updateState(this.state.id);
        NotificationManager.info("Updated Successfully", "Info", 2000);
      }
      else {
        NotificationManager.error(rs.message, "Info", 2000);
      }
      this.props.toggle();
    }
  };

  // ****************** DataFormatter Function *****************************

  DataFormatter = () => {
    let newdivisionSelected = []
    let newDistributorSelected = []
    if (this.state.distributor && this.state.division) {

      this.state.division.map((it) => {
        newdivisionSelected.push(it.value)
        return null
      })
      
      this.state.distributor.map((it) => {
        newDistributorSelected.push(it.value)
        return null
      })
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
    this.setState({ imgFile: imageItem })
    this.setState({ distributorSelected: newDistributorSelected })
    this.setState({ divisionSelected: newdivisionSelected })

  }

  // ****************** Validation Function *****************************

  validation = (e) => {
    if (!this.state.title.trim()) {
      return NotificationManager.error("Please Enter Title", "Info", 2000);
    }
    else if (this.state.description.trim().length >= 1 && this.state.description.trim().length < 3) {
      return NotificationManager.error("Please Valid Name", "Info", 2000)
    }
    else if (!this.state.description.trim()) {
      return NotificationManager.error("Please Enter description", "Info", 2000);
    }
    else if (this.state.description.trim().length >= 1 && this.state.description.trim().length < 5) {
      return NotificationManager.error("Please Valid description", "Info", 2000)
    }
    else if (!this.state.valid_upto) {
      return NotificationManager.error("Please Valid Upto Date", "Info", 2000)
    }

    else { this.setState({ valid: true }); }
  };

  // ****************** componentDidMount Function *****************************

  async componentDidMount() {

    // ------------------Api Response--------------------

    let rs = await GetDistributor({ active: true, is_owner: true })
    let rsDivision = await GetDivisionType()
    if (rs.success === true && rsDivision.success === true) {
      this.setState({ distributorList: rs.data })
      this.setState({ divisionList: rsDivision.data })
    }

    // ---------------------Props Formating----------------

    if (this.props.item) {
      const { id, title, description } = this.props.item;
      this.setState({ id, title, description });

      // ----------------Images------------
      let selectedImages = [];
      let IMAGES = this.props.item.image
      for (let i = 0; i < IMAGES.length; i++) {
        let fileUrl = IMAGES[i];
        selectedImages.push({ url: fileUrl, type: "uploaded" })
      }
      this.setState({ imgUrls: selectedImages })

      // -------------------Date-------------
      var new_date = moment(this.props.item.valid_upto, "YYYY/MM/DD").add(1, 'days');
      let newDate = new Date(new_date).toISOString()
      this.setState({ valid_upto: newDate })

      // ----------Reps & Division---------
      let reps = []
      let division = []
      this.props.item.reps.map((it) => {
        reps.push({ value: it.id, label: it.name })
        return null
      })
      this.props.item.division.map((it) => {
        division.push({ value: it.id, label: it.name })
        return null
      })
      this.setState({ distributor: reps })
      this.setState({ division: division })

    }
  }

  render() {


    const now = new Date()
    const today = moment(now).add(1, 'days').format("YYYY-MM-DD");;

    return (
      <>
        <FormGroup>
          <Label>Title</Label>
          <Input type="text" name="title" id="title" onChange={this.onChange} value={this.state.title === null ? '' : this.state.title} />
        </FormGroup>
        <FormGroup>
          <Label>description</Label>
          <Input type="textarea" name="description" id="description" onChange={this.onChange} value={this.state.description === null ? '' : this.state.description} />
        </FormGroup>
        <FormGroup>
            <Label>Division Type</Label>
            <Select isMulti value={this.state.division} components={animatedComponents} onChange={(selectedOption) => this.setState({division : selectedOption})} options = {this.state.divisionList.map((item) => {
            return { value: item.id, label: item.name};})}/>
        </FormGroup>
        <FormGroup>
          <Label for="distributor">Distributor</Label>
          <Select isMulti value={this.state.distributor} components={animatedComponents} onChange={(selectedOption) => this.setState({ distributor: selectedOption })} options={this.state.distributorList.map((item) => {
            return { value: item.id, label: item.name };
          })} />
        </FormGroup>
        <FormGroup>
          <Label>Valid Upto</Label>
          <Input min={today} type="date" name="date" value={this.state.valid_upto} onChange={(e) => this.setState({ valid_upto: e.target.value })} />
        </FormGroup>

        <Row form>
          {this.state.imgUrls.map(f => {
            return (
              <>
                <Col md={2}>
                  {
                    f.type === "not uploaded" ?
                      <img src={f.url} alt='products' height="80" width="80" />
                      :
                      <>
                        <button onClick={() => this.removeimage(f.url)} className="close AClass">
                          <span>&times;</span>
                        </button>
                        <img src={f.url} alt='products' height="80" width="80" />
                      </>
                  }
                </Col>
              </>
            );
          })}
        </Row>
        <FormGroup>
          <Label>Select Image</Label>
          <Input type="file" accept="image/*" multiple onChange={this.handleUploadImg} />
        </FormGroup>
        <button className="btn btn-primary" onClick={this.props.item ? this.submitFormEdit : this.submitFormAdd}>Submit</button>
      </>
    );
  }
}

export default AddEditForm