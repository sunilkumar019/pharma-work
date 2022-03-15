import React from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { NotificationManager } from "react-notifications";
import { AddPackingType, UpdatePackingType } from "src/api/products/packingType/packingType";

class AddEditForm extends React.Component {
  state = {
    id: "",
    name: "",
    valid: false,
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // ****************** Add Function *****************************

  submitFormAdd = async (e) => {
    e.preventDefault();
    await this.validation();
    if (this.state.valid === true) {
      let rs = await AddPackingType({
        name: this.state.name,
      });
      if (rs) {
        this.props.addItemToState(rs);
        NotificationManager.info("Added Successfully", "Info", 2000);
      }
      else{
        NotificationManager.error("Something Went Wrong", "Error", 2000);
      }
      this.props.toggle();
    }
  };

  // ****************** Edit Function *****************************

  submitFormEdit = async (e) => {
    e.preventDefault();
    await this.validation();
    if (this.state.valid === true) {
      let rs = await UpdatePackingType({id: this.state.id, name: this.state.name });
      if (rs.success === true) {
          NotificationManager.info("Updated Successfully", "Info", 2000);
          this.props.updateState(true);
      }
      else {
        NotificationManager.error(rs.message, "Error", 2000);
      }
      this.props.toggle();
    }
  };

  // ****************** Validation Function *****************************

  validation = (e) => {
    if (!this.state.name.trim()) {
      return NotificationManager.error("Please Enter Packaging type", "Info", 2000);
    } else {
      this.setState({ valid: true });
    }
  };

  // ****************** componentDidMount Function *****************************

  async componentDidMount() {
    if (this.props.item) {
      const { id, name } = this.props.item;
      this.setState({ id, name });
    }
  }

  render() {
    return (
      <Form onSubmit={this.props.item ? this.submitFormEdit : this.submitFormAdd}>
        <FormGroup>
        <Label for="name">Packing Type</Label>
        <Input
          type="disable"
          name="name"
          id="name"
          onChange={this.onChange}
          value={this.state.name === null ? "" : this.state.name}
        />
      </FormGroup> 
        <button className="btn btn-primary">Submit</button>
      </Form>
    );
  }
}

export default AddEditForm