import React from "react";
import { Button, Form, FormGroup, Label } from "reactstrap";
import { NotificationManager } from "react-notifications";
import { UpdatePackingType } from "src/api/products/packingType/packingType";
import { GetProducts } from "src/api/products/allProducts/products";
import Select from 'react-select';
import { AttachPic } from "src/api/gallery/gallery";
import C from '../../../constants'

class AddEditForm extends React.Component {
  state = {
    id: "",
    type: "",
    data: [],
    url: "",
    selectedOption: [],
    isClearable: true,
    isRtl: false,
    isSearchable: true,
  };

  toggleClearable = () =>
    this.setState(state => ({ isClearable: !state.isClearable }));
  toggleSearchable = () =>
    this.setState(state => ({ isSearchable: !state.isSearchable }));

  handleChange = selectedOption => {
    this.setState({ selectedOption });
  };

  // ****************** Add Function *****************************

  submitFormAdd = async (e) => {
    e.preventDefault();
    let newId = this.state.selectedOption.value
    await this.validation();
    if (this.state.valid === true) {
      let newUrl = this.state.url;
      let newType = this.state.type;
      let rs = await AttachPic({
        id: newId,
        url: newUrl.replace(C.SERVER_URL, ''),
        type: newType
      });
      if (rs.success === true) {
        this.props.updated(true)
        NotificationManager.success("Image Attached Successfully", "Info", 2000);
      }
      else {
        NotificationManager.error(rs.message, "Error", 2000);
      }
      this.props.toggle();
    }
  };

  // ****************** Edit Function *****************************

  submitFormDetach = async (e) => {
    e.preventDefault();
    await this.validation();
    if (this.state.valid === true) {
      let rs = await UpdatePackingType({ id: this.state.id, name: this.state.name });
      if (rs.success === true) {
        NotificationManager.info("Image detached Successfully", "Info", 2000);
        this.props.updateState(rs);
      }
      else {
        NotificationManager.error(rs.message, "Error", 2000);
      }
      this.props.toggle();
    }
  };

  // ****************** Validation Function *****************************

  validation = (e) => {
    if (Array.isArray(this.state.selectedOption)) {
      return NotificationManager.error("Please Choose Product", "Info", 2000);
    } else {
      this.setState({ valid: true });
    }
  };


  // ****************** componentDidMount Function *****************************

  async componentDidMount() {
    if (this.props) {
      this.setState({ id: this.props.id })
      this.setState({ type: this.props.type })
      this.setState({ url: this.props.url })
    }
    let rs = await GetProducts();
    let newData = [];
    if (rs.success === true) {
      rs.data.map((it) => {
        if (it.id && it.name) {
          newData.push({ value: it.id, label: it.name })
        } return null
      });
      return this.setState({ data: newData });
    }
  }

  render() {
    const {
      isClearable,
      isSearchable,
    } = this.state;
    return (
      <div className="goldberg">
        <Form
          onSubmit={this.props.item ? this.submitFormDetach : this.submitFormAdd}
        >

          <FormGroup>
            <Label for="name">Choose Product</Label>
            <Select
              isClearable={isClearable}
              isSearchable={isSearchable}
              value={this.state.selectedOption}
              onChange={this.handleChange}
              options={this.state.data}
            />
          </FormGroup>
          <Button>Submit</Button>
        </Form></div>
    );
  }
}

export default AddEditForm