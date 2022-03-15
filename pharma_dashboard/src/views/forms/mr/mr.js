import React, {Component} from "react";
import {Button, Form} from "reactstrap";
import moment from "moment";
import {UpdateRep} from "../../../api/distributor/distributor";
import {NotificationManager} from "react-notifications";
import {isAddress, isIfsc, isName, isPassword, isPhonenumber} from "../../../lib/validator";
import CONFIG from "../../../config";

class MrForm extends Component{
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      phone: "",
      address: "",
      dob: "",
      password: "",
      op_area: "",
      city: "",
      state: "",
      aadhar_no: "",
      active: "true",
      valid: false,

      modal: false
    }

    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    if (this.props.item) {
      const {id, name, email, phone, address, op_area, aadhar_no,} = this.props.item;
      this.setState({id, name, email, phone, address, op_area, aadhar_no});

      if (this.props.item.dob && this.props.item.dob !== "NA") {
        let date1 = new Date(this.props.item.dob);
        let newDate = moment(date1).format("YYYY-MM-DD")
        this.setState({ dob: newDate })
      }
    }
  }

  componentWillUnmount() {
    this.setState({})
  }

  async onFormSubmit (e) {
    e.preventDefault();
    await this.validation(e);
    let newActive = null;

    if (this.state.active === "true") { newActive = true }
    else { newActive = false }

    if (this.state.valid === true) {

      let fields = {
        id : this.state.id,
        profile_pic: this.state.file,
        name: this.state.name,
        email: this.state.email,
        phone: this.state.phone,
        address: this.state.address,
        dob: this.state.dob,
        password: this.state.password,
        op_area: this.state.op_area,
        city: this.state.city,
        state: this.state.state,
        aadhar_no: this.state.aadhar_no,
        active: newActive,
      }

      let rs = await UpdateRep(fields);
      if (rs.success === true) {
        NotificationManager.info("Updated Successfully", "Info", 2000);
        this.props.updateState(rs.data);
      }
      else {
        NotificationManager.error('Something went wrong', "Error", 2000);
      }
      this.props.toggle();
    }
  }

  validation = (e) => {
    if (this.state.name !== null && ! isName(this.state.name))
      return NotificationManager.error("Invalid Distributor Name", "Error", 2000);
      // else if (this.state.email !== null && !isEmail(this.state.email))
    //   return NotificationManager.error("Invalid Distributor email", "Error", 2000);
    else if (this.state.phone !== null && !this.state.phone)
      return NotificationManager.error("Invalid Distributor Phone", "Error", 2000);
    else if (this.state.phone !== null && !isPhonenumber(this.state.phone))
      return NotificationManager.error("Invalid Distributor Phone", "Error", 2000);
    else if (!isPhonenumber(this.state.phone)){
      return NotificationManager.error("Invalid Distributor Phone No.", "Error", 2000)}
      // else if (!isAddress(this.state.address))
    //   return NotificationManager.error("Invalid Distributor Address", "Error", 2000);
    else if (this.state.op_area !== "" && this.state.op_area !== 'NA'  && !isAddress(this.state.op_area))
      return NotificationManager.error("Invalid Distributor Operation Area", "Error", 2000);
      // else if (this.state.aadhar_no !== "" && !isAadhar(this.state.aadhar_no))
    //   return NotificationManager.error("Invalid Distributor Aadhar No", "Error", 2000);
    else if (this.props.item) {
      if (this.state.password !== "" && !isPassword(this.state.password) )
        return NotificationManager.error("Password must be 6 characters long", "Error", 2000);
      else {
        return this.setState({ valid: true })
      }
    }
    else if (this.state.password === "")
      return NotificationManager.error("Please Enter Password", "Error", 2000);
    else if (!isPassword(this.state.password)){
      return NotificationManager.error("Password must be 6 characters long", "Error", 2000);
    }
    else { this.setState({ valid: true });}
  }

  render() {
    return (
        <Form onSubmit={this.onFormSubmit}>
            <div className="col">
              <h6 style={{textAlign: "center"}}>MR Information</h6>
              <br/>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Name</label>
                <div className="col-sm-10">
                  <input type="name" value={this.state.name || ''} name="name"
                         onChange={this.onChange} className="form-control"/>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Email</label>
                <div className="col-sm-10">
                  <input type="email" value={this.state.email || ''} name="email"
                         onChange={this.onChange} className="form-control"/>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Phone</label>
                <div className="col-sm-10">
                  <input type="tel" value={this.state.phone || ''} name="phone"
                         onChange={this.onChange} className="form-control"/>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Address</label>
                <div className="col-sm-10">
                  <input type="text" value={this.state.address || '' } name="address"
                         onChange={this.onChange} className="form-control"/>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Date Of Birth</label>
                <div className="col-sm-10">
                  <input type="date" value={this.state.dob || ''} name="dob" max={moment().format("YYYY-MM-DD")}
                         onChange={this.onChange} className="form-control"/>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Operation Area</label>
                <div className="col-sm-10">
                  <input type="text" value={this.state.op_area || ''} name="op_area"
                         onChange={this.onChange} className="form-control"/>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Password</label>
                <div className="col-sm-10">
                  <input type="text" value={this.state.password || ''} name="password" placeholder="************"
                         onChange={this.onChange} className="form-control"/>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Aadhar Number</label>
                <div className="col-sm-10">
                  <input type="text" value={this.state.aadhar_no || ''} name="aadhar_no"
                         onChange={this.onChange} className="form-control"/>
                </div>
              </div>


              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Status</label>
                <div className="col-sm-10">
                  <div className="form-check form-check-inline">
                    <input id="active" className="form-check-input" checked={this.state.active === "true"}
                           onChange={(e) => this.setState({active: e.target.value})} type="radio"
                           name="inlineRadioOptions" value={"true"}/>
                    <label htmlFor="active" className="form-check-label">Active</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input id="inactive" className="form-check-input" checked={this.state.active === "false"}
                           onChange={(e) => this.setState({active: e.target.value})} type="radio"
                           name="inlineRadioOptions" value={"false"}/>
                    <label htmlFor="inactive" className="form-check-label">In-Active</label>
                  </div>
                </div>
              </div>


              <div className=" d-flex flex-row-reverse">
                <Button color="danger" onClick={this.props.toggle}>Cancel</Button>
                <Button color="primary" type="submit">Submit</Button>
              </div>
            </div>
        </Form>
    );
  }


}

export default MrForm;