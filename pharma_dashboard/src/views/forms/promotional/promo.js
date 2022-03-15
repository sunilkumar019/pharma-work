import React from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { NotificationManager } from "react-notifications";
import { AddPromo, UpdatePromo } from "src/api/promotional/promotional";


async function readDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(reader.result);
      reader.onerror = e => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }
  
class AddEditForm extends React.Component {
  state = {
    id: "",
    stateId: "",
    title: "",
    description:"",
    file: null, image : null, base64: null, objectUrl: null, 
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

// ***************** IMAGE FUNCTION ****************************

  handleChangePhotoFileInput = e => {
    const target = e.currentTarget;
    const file = target.files.item(0);

    // validate file as image
    if (!file.type.startsWith("image/")) {
      return NotificationManager.error("Image Format Not Supported", "Info", 2000)
    }

    // store reference to the File object and a base64 representation of it
    readDataUrl(file).then(dataUrl => {
      this.setState({
        ...this.state,
        file,
        base64: dataUrl,
        objectUrl: URL.createObjectURL(file)
      });
    });
  };

  // ****************** Add Function *****************************

  submitFormAdd = async (e) => {
    e.preventDefault();
    await this.validation();
    if (this.state.valid === true) {
      let rs = await AddPromo({
        title : this.state.title,
        description: this.state.description,
        image: this.state.file,
      });
      if(rs.success === true){
        this.props.addItemToState(rs);
        NotificationManager.info("Added Successfully", "Info", 2000);
      }
      else{
        NotificationManager.error(rs.message, "Info", 2000);
      }
      this.props.toggle();
    }
  };

  // ****************** Edit Function *****************************

  submitFormEdit = async (e) => {
    e.preventDefault();
    await this.validation();
    if (this.state.valid === true) {
      let rs = await UpdatePromo({
        id: this.state.id,
        title : this.state.title,
        description: this.state.description,
        image: this.state.file,
      });
      if(rs.success === true){
        this.props.updateState(true);
        NotificationManager.info("Updated Successfully", "Info", 2000);
      }
      else{
        NotificationManager.error(rs.message, "Info", 2000);
      }
      this.props.toggle();
    }
  };

  // ****************** Validation Function *****************************

  validation = (e) => {
    if (!this.state.title.trim()) {return NotificationManager.error("Please Enter Title", "Info", 2000);} 
    else if (this.state.title.trim().length < 5) {return NotificationManager.error("Title lenght should be more than 5 characters", "Info", 2000);} 
    else if (!this.state.description.trim().length !== "" && this.state.description.trim().length >= 1 && this.state.description.trim().length < 5) 
    {return NotificationManager.error("Please Enter Proper Description", "Info", 2000);} 

    else {this.setState({ valid: true }); }
  };

  // ****************** componentDidMount Function *****************************

  async componentDidMount() {
    if (this.props.item) {
      const { id, title, description } = this.props.item;
      this.setState({ id, title, description });
      this.setState({base64 : this.props.item.image})
    }
  }
  
  render(
  ) {
    let { base64 } = this.state;
    let defaultImage 
    if (!this.state.base64) {
      defaultImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png"
    }
    else {
      defaultImage = this.state.base64 }

    return (
      <Form onSubmit={this.props.item ? this.submitFormEdit : this.submitFormAdd}>
        <FormGroup>
        <Label>Title</Label>
            <Input type="text" name="title" id="title" onChange={this.onChange} value={this.state.title === null ? '' : this.state.title} />
        </FormGroup> 
        <FormGroup>
            <Label>description</Label>
            <Input type="textarea" name="description" id="description" onChange={this.onChange} value={this.state.description === null ? '' : this.state.description} />
        </FormGroup>
        {this.state.base64 ? <FormGroup><img src={base64 || defaultImage} style={{maxWidth:"200px", maxHeight:"200px"}} alt="selected"/> </FormGroup>: <></>}
        <FormGroup>
            <Label>Select Image</Label>
            <Input type="file" accept="image/x-png,image/gif,image/jpeg" name="image" id="image" onChange={this.handleChangePhotoFileInput} ref={input => (this.inputFileRef = input)} />
        </FormGroup>
        <Button  color="primary">Submit</Button>
    </Form>
    );
  }
}

export default AddEditForm