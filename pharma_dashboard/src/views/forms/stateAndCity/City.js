import React from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { NotificationManager } from "react-notifications";
import { AddCity, UpdateCity } from "src/api/stateAndCity/city";

class AddEditForm extends React.Component {
  state = {
    id: "",
    stateId: "",
    name: "",
    newName:"",
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
      let rs = await AddCity({
        stateId : this.state.stateId,
        name: this.state.newName,
      });
      if(rs.success === true) {
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
      let rs = await UpdateCity({
        stateId: this.state.stateId,
        oldName: this.state.name,
        name: this.state.newName,
      });
      if (rs.success === true){
        let json = `{ "stateId": "${this.state.stateId}" , "name" : "${this.state.name}"}`  
        var newRs = JSON.parse(JSON.stringify(json));
        this.props.updateState(newRs);
        NotificationManager.info("Updated Successfully", "Info", 2000);
      }
      else{
        NotificationManager.error(rs.message, "Error", 2000);
      }
        this.props.toggle();
    }
  };

  // ****************** Validation Function *****************************

  validation = (e) => {
    if (!this.state.newName.trim()) {
      return NotificationManager.error("Please Enter City", "Info", 2000);
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
    if (this.props.stateId){
      this.setState({stateId : this.props.stateId })
    }
  }

  render() {
    return (
      <Form
        onSubmit={this.props.item ? this.submitFormEdit : this.submitFormAdd}
      >


        <FormGroup>
          <Label>Name</Label>
          <Input
            type="text"
            name="newName"
            id="newName"
            onChange={this.onChange}
            value={this.state.newName}
          />
        </FormGroup>
        <Button  color="primary">Submit</Button>
      </Form>
    );
  }
}

export default AddEditForm