import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody, Button, ModalFooter } from "reactstrap";
import { DetachPic } from "src/api/gallery/gallery";
import AddEditForm from "../../forms/gallery/gallery";
import C from '../../../constants'
import { NotificationManager } from "react-notifications";

class ModalForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false
    }
  }

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }))
  }

  detachProduct = async () => {
    let rs = await DetachPic({
      id: this.props.id,
      url: (this.props.images).replace(C.SERVER_URL, ''),
      type: this.props.type
    })
    if (rs.success === true) {
      NotificationManager.success("Image Detached Successfully", "Info", 2000);
      this.props.updated(true)
    }
    else {
      NotificationManager.error("Something Went Wrong", "Error", 2000);
    }
    this.toggle();
  }

  render() {
    const closeBtn = <button className="close" onClick={this.toggle}>&times;</button>
    const label = this.props.buttonLabel
    let button = ''
    let title = ''
    if (label === 'Detach') {
      button = <button className="glass_button_detach"
        // style={{ float: "left", marginRight: "10px" }}
        onClick={this.toggle}>
        <b>{label}</b>
      </button>
      title = 'Detach'
    } else {
      button = <button className="glass_button_attach"
        onClick={this.toggle}>
        <b>{label}</b>
      </button>
      title = 'Attach'
    }

    
    return (
      <div >
        {button}
        {this.props.buttonLabel === "Attach" ?
          <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
            <ModalHeader toggle={this.toggle} close={closeBtn}>{title}</ModalHeader>
            <ModalBody>
              <AddEditForm
                id={this.props.id}
                url={this.props.url}
                type={this.props.type}
                updated={this.props.updated}
                visualate={this.props.visualate}
                toggle={this.toggle}
              />
            </ModalBody>
          </Modal>
          :
          <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
            <ModalHeader toggle={this.toggle} close={closeBtn}>{title}</ModalHeader>
            <ModalBody>
              <h6><b style={{ fontWeight: "bold" }}>PRODUCT :</b><span style={{ color: "#5b5a5a", letterSpacing: "2px" }}> {this.props.name}</span></h6>
              <ModalFooter>
                <Button color="danger" onClick={this.detachProduct}>Detach</Button>
              </ModalFooter>
            </ModalBody>
          </Modal>
        }
      </div>
    )
  }
}

export default ModalForm