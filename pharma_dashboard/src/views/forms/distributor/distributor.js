import React from "react";
import { Button, Form, Input } from "reactstrap";
import { NotificationManager } from "react-notifications";
import { GetDivisionType } from '../../../api/products/divisionType/divisionType'
import Select from 'react-select';
import { AddRepAndFranchisee, UpdateRepAndFranchisee } from '../../../api/distributor/distributor'
import { GetFranchisee } from '../../../api/distributor/franchisee'
import moment from "moment";
import CONFIG from "./../../../config";
import {isAadhar, isAddress, isEmail, isGstNo, isIfsc, isName, isPassword, isPhonenumber} from '../../../lib/validator'

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
    frId: "",
    firm_name: "",
    gst_number: "",
    drug_license: "",
    firm_phone: "",
    firm_email: "",
    firm_address: "",
    firm_state: "",
    firm_district: "",
    bank_name: "",
    bank_ifsc: "",
    bank_acc_no: "",
    bank_payee_name: "",
    divisions: "",

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
    file: null, image: null, base64: null, objectUrl: null,

    divisionsList: [],
    selectedDivision: [],
    valid: false,
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // ****************** Add Function *****************************

  submitFormAdd = async (e) => {
    e.preventDefault();
    await this.validation();
    let newActive = null;
    let divisions = []
    if (Array.isArray(this.state.selectedDivision)) {
      this.state.selectedDivision.map((it) => {
        divisions.push(it.value)
        return true
      })
    }
    if (this.state.active === "true") { newActive = true } else { newActive = false }

    if (this.state.valid === true) {
      if (!this.state.password && isPassword(this.state.password))
        return NotificationManager.error("Please Enter Password", "Info", 2000);

      let fields = {
        frId : this.state.frId,
        firm_name: this.state.firm_name,
        gst_number: this.state.gst_number,
        drug_license: this.state.drug_license,
        firm_phone: this.state.firm_phone,
        firm_email: this.state.firm_email,
        firm_address: this.state.firm_address,
        firm_state: this.state.firm_state,
        firm_district: this.state.firm_district,
        bank_name: this.state.bank_name,
        bank_ifsc: this.state.bank_ifsc,
        bank_acc_no: this.state.bank_acc_no,
        bank_payee_name: this.state.bank_payee_name,
        divisions: divisions.toString(),

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

      // if (CONFIG.FIRM_GST_NUMBER) fields.gst_number = this.state.gst_number;
      // if (CONFIG.FIRM_DRUG_LICENCE) fields.drug_license = this.state.drug_license;
      // if (CONFIG.FIRM_PHONE) fields.firm_phone = this.state.firm_phone;
      // if (CONFIG.FIRM_EMAIL) fields.firm_email = this.state.firm_email;
      // if (CONFIG.FIRM_ADDRESS) fields.firm_address = this.state.firm_address;
      // if (CONFIG.FIRM_STATE) fields.firm_state = this.state.firm_state;
      // if (CONFIG.FIRM_DISTRICT) fields.firm_district = this.state.firm_district;
      // if (CONFIG.FIRM_BANK_NAME) fields.bank_name = this.state.bank_name;
      // if (CONFIG.FIRM_BANK_IFSC) fields.bank_ifsc = this.state.bank_ifsc;
      // if (CONFIG.FIRM_BANK_ACC_NO) fields.bank_acc_no = this.state.bank_acc_no;
      // if (CONFIG.FIRM_BANK_PAYEE_NAME) fields.bank_payee_name = this.state.bank_payee_name;
      // if (CONFIG.REP_PROFILE_PIC) fields.profile_pic = this.state.file;
      // if (CONFIG.REP_ADDRESS) fields.address = this.state.address;
      // if (CONFIG.REP_DOB) fields.dob = this.state.dob;
      // if (CONFIG.REP_OP_AREA) fields.op_area = this.state.op_area;
      // if (CONFIG.REP_AADHAR_NO) fields.aadhar_no = this.state.aadhar_no;
      // // if(CONFIG.REP_CITY) fields.
      // if(CONFIG.REP_STATE) fields.

      let rs = await AddRepAndFranchisee(fields);
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


  // ****************** Edit Function *****************************

  submitFormEdit = async (e) => {
    e.preventDefault();
    await this.validation();
    let newActive = null;

    let divisions = []
    if (Array.isArray(this.state.selectedDivision)) {
      this.state.selectedDivision.map((it) => {
        divisions.push(it.value)
        return true
      })
    }
    if (this.state.active === "true") { newActive = true }
    else { newActive = false }

    if (this.state.valid === true) {

      let fields = {
        frId : this.state.frId,
        firm_name: this.state.firm_name,
        gst_number: this.state.gst_number,
        drug_license: this.state.drug_license,
        firm_phone: this.state.firm_phone,
        firm_email: this.state.firm_email,
        firm_address: this.state.firm_address,
        firm_state: this.state.firm_state,
        firm_district: this.state.firm_district,
        bank_name: this.state.bank_name,
        bank_ifsc: this.state.bank_ifsc,
        bank_acc_no: this.state.bank_acc_no,
        bank_payee_name: this.state.bank_payee_name,
        divisions: divisions.toString(),

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


      // if (CONFIG.FIRM_GST_NUMBER) fields.gst_number = this.state.gst_number;
      // if (CONFIG.FIRM_DRUG_LICENCE) fields.drug_license = this.state.drug_license;
      // if (CONFIG.FIRM_PHONE) fields.firm_phone = this.state.firm_phone;
      // if (CONFIG.FIRM_EMAIL) fields.firm_email = this.state.firm_email;
      // if (CONFIG.FIRM_ADDRESS) fields.firm_address = this.state.firm_address;
      // if (CONFIG.FIRM_STATE) fields.firm_state = this.state.firm_state;
      // if (CONFIG.FIRM_DISTRICT) fields.firm_district = this.state.firm_district;
      // if (CONFIG.FIRM_BANK_NAME) fields.bank_name = this.state.bank_name;
      // if (CONFIG.FIRM_BANK_IFSC) fields.bank_ifsc = this.state.bank_ifsc;
      // if (CONFIG.FIRM_BANK_ACC_NO) fields.bank_acc_no = this.state.bank_acc_no;
      // if (CONFIG.FIRM_BANK_PAYEE_NAME) fields.bank_payee_name = this.state.bank_payee_name;
      // if (CONFIG.REP_PROFILE_PIC) fields.profile_pic = this.state.file;
      // if (CONFIG.REP_ADDRESS) fields.address = this.state.address;
      // if (CONFIG.REP_DOB) fields.dob = this.state.dob;
      // if (CONFIG.REP_OP_AREA) fields.op_area = this.state.op_area;
      // if (CONFIG.REP_AADHAR_NO) fields.aadhar_no = this.state.aadhar_no;


      let rs = await UpdateRepAndFranchisee(fields);
      if (rs.success === true) {
        this.props.updateState(true);
        NotificationManager.info("Updated Successfully", "Info", 2000);
      }
      else {
        NotificationManager.error('Something went wrong', "Error", 2000);
      }
      this.props.toggle();
    }
  };


  // ****************** Validation Function *****************************

  validation = (e) => {
    if (!isName(this.state.firm_name)) return NotificationManager.error("Please Enter Firm Name", "Info", 2000);
    else if (this.state.firm_name === "")
      return NotificationManager.error("Invalid firm_name", "Error", 2000);
    // else if (CONFIG.FIRM_EMAIL) if (!this.state.firm_email)
    //   return NotificationManager.error("Please Enter Firm Email", "Error", 2000);
    // else if (this.state.firm_address && !isAddress(this.state.firm_address) )
    //   return NotificationManager.error("Invalid Franchisee Address", "Error", 2000);
    else if (this.state.firm_district !== null  && ! isName(this.state.firm_district) )
      return NotificationManager.error("Please Enter Valid District", "Error", 2000);
    // else if (this.state.gst_number !== "" && this.state.gst_number !== 'NA' && ! isGstNo(this.state.gst_number)){
    //   return NotificationManager.error("Invalid GST No.", "Error", 2000);}
    else if (this.state.drug_license !== null && this.state.drug_license !== "" && this.state.drug_license.length === 1  )
      return NotificationManager.error("Please Enter Valid Drug Licence No.", "Error", 2000);
    else if (this.state.bank_name !== "" && this.state.bank_name !== null && !isName(this.state.bank_name))
      return NotificationManager.error("Invalid Bank Name", "Error", 2000);
    else if (this.state.bank_acc_no !== "" && this.state.bank_acc_no !== null && !this.state.bank_acc_no > 9)
      return NotificationManager.error("Invalid Bank Acc No.", "Error", 2000);
    else if (this.state.bank_ifsc !== "" && this.state.bank_ifsc !== null && ! isIfsc(this.state.bank_ifsc))
      return NotificationManager.error("Invalid IFSC Code", "Error", 2000);

    else if (this.state.bank_payee_name !== "" && !isName(this.state.bank_payee_name))
      return NotificationManager.error("Invalid Payee Name", "Error", 2000);
    else if (this.state.name !== null && ! isName(this.state.name))
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

  // ****************** componentDidMount Function *****************************

  async componentDidMount() {
    if (this.props.item) {
      const { id, name, email, phone, address, op_area, aadhar_no,  } = this.props.item;
      this.setState({ id, name, email, phone, address, op_area, aadhar_no ,  });


      if (this.props.item.profile_pic_url != null) {
        this.setState({ base64: this.props.item.profile_pic_url })
      }
      if (this.props.item.dob && this.props.item.dob !== "NA") {
        let date1 = new Date(this.props.item.dob);
        let newDate = moment(date1).format("YYYY-MM-DD")
        this.setState({ dob: newDate })
      }

      if (this.props.item.active === true) {
        this.setState({ active: "true" })
      } else { this.setState({ active: "false" }) }

      let fId = this.props.item.franchisee_id
      let fcRs = await GetFranchisee({
        id: fId
      })
      if (fcRs.success === true) {
        this.setState({ frId: fcRs.data.id })
        this.setState({ firm_name: fcRs.data.name })
        this.setState({ firm_email: fcRs.data.email })
        this.setState({ firm_phone: fcRs.data.phone })
        this.setState({ firm_address: fcRs.data.address })
        this.setState({ firm_state: fcRs.data.state })
        this.setState({ firm_district: fcRs.data.district })
        this.setState({ gst_number: fcRs.data.gst_number })
        this.setState({ drug_license: fcRs.data.drug_license })
        this.setState({ bank_name: fcRs.data.bank_name })
        this.setState({ bank_acc_no: fcRs.data.bank_acc_no })
        this.setState({ bank_ifsc: fcRs.data.bank_ifsc })
        this.setState({ bank_payee_name: fcRs.data.bank_payee_name })
        let divList = []
        if (Array.isArray(fcRs.data.divisions)) {
          fcRs.data.divisions.map((it) => {
            divList.push({ value: it.id, label: it.name })
            return true
          })
        }
        this.setState({ selectedDivision: divList })
      }
    }
    let rs = await GetDivisionType()

    if (rs.success === true) {
      this.setState({ divisionsList: rs.data })

    }
  }



  render() {

    return (
        <Form onSubmit={this.props.item ? this.submitFormEdit : this.submitFormAdd}>
          <div className="container">
            <div className="row">

              {/* ------------------------------Franchisee Information---------------------------- */}

              <div className="col-md-6">
                <h6 style={{ textAlign: "center" }}>Franchisee Information</h6>

                <div className="form-group row" style={{ marginTop: "30px" }}>
                  <label className="col-sm-2 col-form-label">Name</label>
                  <div className="col-sm-10">
                    <input type="text" value={this.state.firm_name} name="firm_name"
                           onChange={this.onChange} className="form-control" />
                  </div>
                </div>

                {CONFIG.FIRM_EMAIL && (
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">Email</label>
                      <div className="col-sm-10">
                        <input type="email" value={this.state.firm_email} name="firm_email"
                               onChange={this.onChange} className="form-control" />
                      </div>
                    </div>
                )}

                {CONFIG.FIRM_PHONE && (
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">Phone</label>
                      <div className="col-sm-10">
                        <input type="tel" minLength = "10" maxLength = "10" value={this.state.firm_phone} name="firm_phone"
                               onChange={this.onChange} className="form-control" />
                      </div>
                    </div>
                )}

                {CONFIG.FIRM_ADDRESS && (
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">Address</label>
                      <div className="col-sm-10">
                        <input type="text" value={this.state.firm_address} name="firm_address"
                               onChange={this.onChange} className="form-control" />
                      </div>
                    </div>
                )}

                {CONFIG.FIRM_DISTRICT && (
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">District</label>
                      <div className="col-sm-10">
                        <input type="text" value={this.state.firm_district} name="firm_district"
                               onChange={this.onChange} className="form-control" />
                      </div>
                    </div>
                )}

                {CONFIG.FIRM_STATE && (
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">State</label>
                      <div className="col-sm-10">
                        <input type="text" value={this.state.firm_state} name="firm_state"
                               onChange={this.onChange} className="form-control" />
                      </div>
                    </div>
                )}

                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">Divisions</label>
                  <div className="col-sm-10">
                    <Select isMulti value={this.state.selectedDivision} onChange={(selectedOption) => this.setState({ selectedDivision: selectedOption })} options={this.state.divisionsList.map((item) => {
                      return { value: item.id, label: item.name };
                    })} />
                  </div>
                </div>

                {CONFIG.FIRM_GST_NUMBER && (
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">GST No.</label>
                      <div className="col-sm-10">
                        <input type="text" value={this.state.gst_number} name="gst_number"
                               onChange={this.onChange} className="form-control" />
                      </div>
                    </div>
                )}

                {CONFIG.FIRM_DRUG_LICENCE && (
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">Drug Licence</label>
                      <div className="col-sm-10">
                        <input type="text" maxLength='14' value={this.state.drug_license} name="drug_license"
                               onChange={this.onChange} className="form-control" />
                      </div>
                    </div>
                )}

                {CONFIG.FIRM_BANK_NAME && (
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">Bank Name</label>
                      <div className="col-sm-10">
                        <input type="tel" value={this.state.bank_name} name="bank_name"
                               onChange={this.onChange} className="form-control" />
                      </div>
                    </div>
                )}

                {CONFIG.FIRM_BANK_ACC_NO && (
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">Account Number</label>
                      <div className="col-sm-10">
                        <input type="tel" value={this.state.bank_acc_no} name="bank_acc_no"
                               onChange={this.onChange} className="form-control" />
                      </div>
                    </div>
                )}

                {CONFIG.FIRM_BANK_IFSC && (
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">Bank IFSC</label>
                      <div className="col-sm-10">
                        <input type="tel" value={this.state.bank_ifsc} name="bank_ifsc"
                               onChange={this.onChange} className="form-control" />
                      </div>
                    </div>
                )}
                {CONFIG.FIRM_BANK_PAYEE_NAME && (
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">Payee Name</label>
                      <div className="col-sm-10">
                        <input type="tel" value={this.state.bank_payee_name} name="bank_payee_name"
                               onChange={this.onChange} className="form-control" />
                      </div>
                    </div>
                )}

              </div>
              <hr />

              {/* ------------------------------Distributor Information---------------------------- */}



              <div className="col-md-6">
                <h6 style={{ textAlign: "center" }}>Distributor Information</h6>
                <br />
                {CONFIG.REP_PROFILE_PIC && (
                    <>
                      <div className="col-xl-4 order-xl-2" style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}>
                        {this.state.base64 !== null ?
                            <img style={{ maxWidth: "100px" }} src={this.state.base64} className="rounded-circle" alt="profile placeholder" />
                            :
                            <img style={{ maxWidth: "100px" }} src="http://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png" className="rounded-circle" alt="profile placeholder" />
                        }
                      </div>
                      <div className="form-group row" style={{ marginTop: "30px" }}>
                        <label className="col-sm-2 col-form-label">Profile Pic</label>
                        <div className="col-sm-10">
                          <Input type="file" accept="image/x-png,image/gif,image/jpeg" name="image" id="image"
                                 onChange={this.handleChangePhotoFileInput} ref={input => (this.inputFileRef = input)} />
                        </div>
                      </div>
                    </>
                )}


                <div className="form-group row" >
                  <label className="col-sm-2 col-form-label">Name</label>
                  <div className="col-sm-10">
                    <input type="name" value={this.state.name} name="name"
                           onChange={this.onChange} className="form-control" />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">Email</label>
                  <div className="col-sm-10">
                    <input type="email" value={this.state.email} name="email"
                           onChange={this.onChange} className="form-control" />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">Phone</label>
                  <div className="col-sm-10">
                    <input type="tel" value={this.state.phone} name="phone"
                           onChange={this.onChange} className="form-control" />
                  </div>
                </div>
                {CONFIG.REP_ADDRESS && (
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">Address</label>
                      <div className="col-sm-10">
                        <input type="text" value={this.state.address} name="address"
                               onChange={this.onChange} className="form-control" />
                      </div>
                    </div>
                )}

                {CONFIG.REP_DOB && (
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">Date Of Birth</label>
                      <div className="col-sm-10">
                        <input type="date" value={this.state.dob} name="dob" max={moment().format("YYYY-MM-DD")}
                               onChange={this.onChange} className="form-control" />
                      </div>
                    </div>
                )}

                {CONFIG.REP_OP_AREA && (
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">Operation Area</label>
                      <div className="col-sm-10">
                        <input type="text" value={this.state.op_area} name="op_area"
                               onChange={this.onChange} className="form-control" />
                      </div>
                    </div>
                )}


                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">Password</label>
                  <div className="col-sm-10">
                    <input type="text" value={this.state.password} name="password" placeholder="************"
                           onChange={this.onChange} className="form-control" />
                  </div>
                </div>

                {CONFIG.REP_AADHAR_NO && (
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">Aadhar Number</label>
                      <div className="col-sm-10">
                        <input type="text" value={this.state.aadhar_no} name="aadhar_no"
                               onChange={this.onChange} className="form-control" />
                      </div>
                    </div>
                )}



                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">Status</label>
                  <div className="col-sm-10">
                    <div className="form-check form-check-inline">
                      <input id="active" className="form-check-input" checked={this.state.active === "true"}
                             onChange={(e) => this.setState({ active: e.target.value })} type="radio" name="inlineRadioOptions" value={"true"} />
                      <label htmlFor="active" className="form-check-label" >Active</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input id="inactive" className="form-check-input" checked={this.state.active === "false"} onChange={(e) => this.setState({ active: e.target.value })} type="radio" name="inlineRadioOptions" value={"false"} />
                      <label htmlFor="inactive" className="form-check-label" >In-Active</label>
                    </div>
                  </div>
                </div>



                <div className=" d-flex flex-row-reverse">
                  <Button color="danger" onClick={this.props.toggle}>Cancel</Button>
                  <Button color="primary" type="submit">Submit</Button>
                </div>
              </div>
            </div>
          </div>
        </Form>
    );
  }
}

export default AddEditForm