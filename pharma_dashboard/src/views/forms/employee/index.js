import React from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { NotificationManager } from "react-notifications";
import { isName } from "src/lib/validator";
import { AddEmployee, UpdateEmployee } from "src/api/employee";


class AddEditForm extends React.Component {
  state = {
    id: "",
    name: "",
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // ****************** Add Function *****************************

  submitFormAdd = async (e) => {
    e.preventDefault();
    await this.validation();
    if (this.state.valid === true) {
      let rs = await AddEmployee({
        name: this.state.name,
      });
      if (rs.success === true) {
        this.props.addItemToState(true);
        NotificationManager.info("Employee Added Successfully", "Info", 2000);
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
      let rs = await UpdateEmployee({
        id: this.state.id,
        name: this.state.name,
      });
      if (rs.success === true) {
        this.props.updateState(true);
        NotificationManager.info("Employee Updated Successfully", "Info", 2000);
      }
      else {
        NotificationManager.error(rs.message, "Error", 2000);
      }
      this.props.toggle();
    }
  };

  // ****************** Validation Function *****************************

  validation = (e) => {
    if (!isName(this.state.name)) { return NotificationManager.error("Please Enter Employee Name", "Info", 2000); }
    else { this.setState({ valid: true }); }
  };

  // ****************** componentDidMount Function *****************************

  async componentDidMount() {
    if (this.props.item) {
      const { id, name, description } = this.props.item;
      this.setState({ id, name, description });
    }
  }

  render(
  ) {
    return (
      <Form onSubmit={this.props.item ? this.submitFormEdit : this.submitFormAdd}>
        <FormGroup>
          <Label>Employee Name</Label>
          <Input type="text" name="name" id="name" onChange={this.onChange} value={this.state.name === null ? '' : this.state.name} />
        </FormGroup>
        <Button color="primary">Submit</Button>
      </Form>
    );
  }
}

export default AddEditForm