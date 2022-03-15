import React from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { NotificationManager } from "react-notifications";
import { AddCategoryType, UpdateCategoryType } from "src/api/products/category/category";

class AddEditForm extends React.Component {
  state = {
    id: "",
    name: "",
    valid: false,
    active: null,
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  stringToBoolean = (string) => string === 'false' ? false : true

  // ****************** Add Function *****************************

  submitFormAdd = async (e) => {
    e.preventDefault();
    await this.validation();
    if (this.state.valid === true) {
      let rs = await AddCategoryType({
        name: this.state.name,
        active: this.state.active,
      });
      if (rs.success === true) {
        this.props.addItemToState(true);
        NotificationManager.info("Added Successfully", "Info", 2000);
      }
      else {
        NotificationManager.error(rs.message, "Error", 2000);
      }
      this.props.toggle();
    }
  };

  // ****************** Edit Function *****************************

  submitFormEdit = async (e) => {
    e.preventDefault();
    await this.validation();
    let activeStatus = await this.stringToBoolean(this.state.active)
    if (this.state.valid === true) {
      let rs = await UpdateCategoryType({
        id: this.state.id,
        name: this.state.name,
        active: activeStatus,
      });
      if (rs.success === true) {
        NotificationManager.info("Updated Successfully", "Info", 2000);
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
    if (!this.state.name.trim()) {
      return NotificationManager.error("Please Enter Division", "Info", 2000);
    }
    else if (this.state.active === null) {
      return NotificationManager.error("Please Enter Status", "Info", 2000);
    }
    else {
      this.setState({ valid: true });
    }
  };

  // ****************** componentDidMount Function *****************************

  async componentDidMount() {
    if (this.props.item) {
      const { id, name, active } = this.props.item;
      this.setState({ id, name, active });
    }
  }


  render() {
    return (
      <Form
        onSubmit={this.props.item ? this.submitFormEdit : this.submitFormAdd}
      >
        <FormGroup>
          <Label for="name">Category Type</Label>
          <Input
            type="text"
            name="name"
            onChange={this.onChange}
            value={this.state.name === null ? "" : this.state.name}
          />
        </FormGroup>
        <FormGroup>
          <Label for="select">Status</Label>
          <Input type="select" name="select" onChange={(e) => this.setState({ active: e.target.value })}
            value={this.state.active === null ? null : this.state.active}>
            <option disabled selected value={null}>Select</option>
            <option value={true}>Active</option>
            <option value={false}>InActive</option>
          </Input>
        </FormGroup>
        <Button color="primary">Submit</Button>
      </Form>
    );
  }
}

export default AddEditForm