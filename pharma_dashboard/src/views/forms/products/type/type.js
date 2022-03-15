import React from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { NotificationManager } from "react-notifications";
import { AddType, UpdateType } from "src/api/products/productType/productType";

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
      let rs = await AddType({
        name: this.state.name,
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
    if (this.state.valid === true) {
      let rs = await UpdateType({ id: this.state.id, name: this.state.name });
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
      <Form
        onSubmit={this.props.item ? this.submitFormEdit : this.submitFormAdd}
      >
        <FormGroup>
          <Label for="name">Product Type</Label>
          <Input
            name="name"
            id="name"
            onChange={this.onChange}
            value={this.state.name === null ? "" : this.state.name}
          />
        </FormGroup>
        <Button color="primary">Submit</Button>
      </Form>
    );
  }
}

export default AddEditForm