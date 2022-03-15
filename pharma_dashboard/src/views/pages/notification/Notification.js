import React, { Component } from 'react'
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput } from "mdbreact";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Col, Form, Row } from "reactstrap";
import { NotificationManager } from "react-notifications";
import { NotifiGetDistributor, NotifiGetMr, SendNotification } from 'src/api/notification/notification';
const animatedComponents = makeAnimated();

const options = [
  { value: 'distributors', label: 'All Distributors' },
  { value: 'mr', label: 'All Medical Representatives' },
  { value: 'both', label: 'All Distributors and MRs' },
  { value: 'singleDistributor', label: 'Single Distributor' },
  { value: 'singleMr', label: 'Single Medical Representatives' }
]

export default class Notification extends Component {
  constructor() {
    super();
    this.state = {
      user: [],
      title: "",
      message: "",
      send_to: "",
      distributor: [],
      mr: [],
      mrList: [],
      distributorList: [],
      valid: false,
      class: "btn_notify",
      button_text: "SEND"
    };
  }

  // ***************************SEND NOTIFICATION FUNCTION ***************************

  sendNotification = async () => {
    this.setState({ class: "btn_notify send" })
    // this.setState({button_text : "Sending..."})

    await this.validation();
    if (this.state.valid === true) {
      let rs = await SendNotification({
        message: this.state.message,
        title: this.state.title,
        send_to: this.state.send_to
      })
      if (rs.success === true) {
        this.setState({ button_text: "Sent" })
        NotificationManager.success("Notification Sent Successfully", "Info", 2000);
      } else {
        NotificationManager.error(rs.message, "Error", 2000);
      }
      this.setState({ valid: false });
    }
    // this.setState({class : "btn_notify"})
    this.setState({ class: "btn_notify" })
    this.setState({ button_text: "SEND" })


  };


  sendTO = () => {
    if (this.state.user.value === "distributors") {
      return this.setState({ send_to: "Distributor" })
    }
    else if (this.state.user.value === "mr") {
      return this.setState({ send_to: "MR" })
    }
    else if (this.state.user.value === "both") {
      return this.setState({ send_to: "Both" })
    }
    else if (this.state.user.value === "singleMr") {
      return this.setState({ send_to: this.state.mr.value })
    }
    else if (this.state.user.value === "singleDistributor") {
      return this.setState({ send_to: this.state.distributor.value })
    }
  }

  // ***************************FORM VALIDATION FUNCTION ***************************

  validation = async () => {
    if (!this.state.title.trim()) {
      return NotificationManager.error("Please Enter Title", "Info", 2000);
    } else if (!this.state.message.trim()) {
      return NotificationManager.error("Please Enter Message", "Info", 2000);
    } else if (this.state.user === null || this.state.user.length === 0) {
      return NotificationManager.error("Please Select User", "Info", 2000);
    } else if (this.state.user.value === "singleDistributor" && Array.isArray(this.state.distributor)) {
      return NotificationManager.error("Please select Distributor", "Info", 2000)
    } else if (this.state.user.value === "singleMr" && Array.isArray(this.state.mr)) {
      return NotificationManager.error("Please select Mr", "Info", 2000)
    }
    await this.sendTO();
    this.setState({ valid: true })
  }

  // ***************************COMPONENT DID MOUNT FUNCTION ***************************

  async componentDidMount() {
    let rsDb = await NotifiGetDistributor();
    let rsMr = await NotifiGetMr();
    let newListDb = [];
    let newListMr = [];

    if (rsDb.success === true) {
      rsDb.data.map((it) => {
        if (it.device_token === null || it.device_token === "undefine" || it.device_token === "") {
          return true
        }
        else {
          newListDb.push(it);
        }
        return newListDb
      }
      );
      this.setState({ mrList: newListMr });
    }
    if (rsMr.success === true) {
      rsMr.data.map((it) => {
        if (it.device_token === null || it.device_token === "undefine" || it.device_token === "") {
          return null ;
        }
        else {
          newListMr.push(it);
        }
        return newListMr
      }
      );
      this.setState({ distributorList: newListDb });
    }
  }

  // ***************************RENDER FUNCTION ***************************
  render() {
    return (
      <Form >
        <MDBRow>
          <MDBCol>
            <MDBCard>
              <MDBCardBody>
                <div>
                  <h5 className="mt-2 notification_heading" >
                    Send Notification
                  </h5>
                </div>
                <div className="md-form">
                  <MDBInput icon="tag" label="Title"
                    value={this.state.title}
                    onChange={(e) => this.setState({ title: e.target.value })}
                    className="black-text"
                    type="text"
                  />
                  
                </div>
                <div className="md-form">
                  <MDBInput
                    icon="pencil-alt"
                    label="Message"
                    value={this.state.message}
                    onChange={(e) => this.setState({ message: e.target.value })}
                    className="black-text"
                    type="textarea"
                  />
                </div>
                <Row>
                  <Col style={{ maxWidth: "30px" }}>
                    <i style={{ fontSize: "25px", color: "#3c4b64" }} className="fas fa-user-tag" />
                  </Col>
                  <Col style={{ marginLeft: "10px" }}>
                    <Select onChange={(selectedOption) =>
                      this.setState({ user: selectedOption })}
                      options={options}
                      components={animatedComponents}
                      placeholder={<div>Select User</div>}
                    />
                  </Col>
                </Row>

                {this.state.user !== null &&
                  this.state.user.value === "singleDistributor" ? (
                  <div className="md-form">
                    <Row>
                      <Col style={{ maxWidth: "30px" }}>
                        <i style={{ fontSize: "25px", color: "#3c4b64" }} className="fas fa-user-tag" />
                      </Col>
                      <Col style={{ marginLeft: "10px" }}>
                        <Select value={this.state.distributor}
                          onChange={(selectedOption) =>
                            this.setState({ distributor: selectedOption })}
                          options={
                            Array.isArray(this.state.distributorList)
                              ? this.state.distributorList.map((item) => {
                                return {
                                  value: item.device_token,
                                  label: `${item.name}(${item.phone})`,
                                };
                              })
                              : null
                          }
                          placeholder={<div>Select Distributor Name</div>}
                        />
                          <div className="alert alert-warning" role="alert" style={{marginTop : "15px"}}>
                            <b>INFO -</b> you can send notification only to those <b>Distributor</b> who is currunty logged in into their
                            devices
                          </div>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <> </>
                )}

                {this.state.user !== null &&
                  this.state.user.value === "singleMr" ? (
                  <div className="md-form">
                    <Row>
                      <Col style={{ maxWidth: "30px" }}>
                        <i style={{ fontSize: "25px", color: "#9E9E9E" }} className="fas fa-user-tag" />
                      </Col>
                      <Col style={{ marginLeft: "10px" }}>
                        <Select
                          onChange={(selectedOption) =>{
                            // console.log("SELECTED", selectedOption)
                            this.setState({mr : selectedOption})
                            // this.state.mr(selectedOption)
                          }}
                          options={Array.isArray(this.state.mrList)
                            ? this.state.mrList.map((item) => {
                              return {
                                value: item.device_token,
                                label: `${item.name}(${item.phone})`,
                              };
                            })
                            : null
                          }
                          components={animatedComponents}
                          placeholder={<div>Select Medical Representative</div>}
                        />
                        <div className="alert alert-warning" role="alert" style={{ marginTop: "15px" }}>
                          <b>INFO -</b> you can send notification only to those <b>Medical Representative</b> who is currunty logged in into their
                          devices
                        </div>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <> </>
                )}

                <div className="text-center" style={{ marginTop: "20px" }}>
                  <div className="row_notify">
                    <span className={this.state.class} onClick={this.sendNotification}>{this.state.button_text}<i className="fad fa-paper-plane"></i></span>
                  </div>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </Form>
    );
  }
}


