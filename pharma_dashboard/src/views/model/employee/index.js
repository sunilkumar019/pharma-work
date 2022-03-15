import { CButton } from "@coreui/react";
import React, { Component } from "react";
import {Modal, ModalHeader, ModalBody } from "reactstrap";
import { IconEdit } from "src/views/icon";
import AddEditForm from "../../forms/employee";

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

  render() {
    const closeBtn = <button className="close" onClick={this.toggle}>&times;</button>
    const label = this.props.buttonLabel
    let button = ''
    let title = ''
    if (label === 'Edit') {
      button = <CButton size="sm" color="info"
        style={{ float: "left", marginRight: "10px" }}
        onClick={this.toggle}>
        <IconEdit />
      </CButton>
      title = 'Edit Employee'
    } else {
      button = <button
                size="sm"
                className = "button_add" 
                color="success"
                onClick={this.toggle}>
                {label}{' '}<i className="fas fa-plus"></i>
              </button>
      title = 'Add Employee'
    }

    return (
      <div>
        {button}
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle} close={closeBtn}>{title}</ModalHeader>
          <ModalBody>
            <AddEditForm
              addItemToState={this.props.addItemToState}
              updateState={this.props.updateState}
              toggle={this.toggle}
              item={this.props.item} />
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

export default ModalForm