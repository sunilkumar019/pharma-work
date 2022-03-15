import React, {Component} from "react";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {CButton} from "@coreui/react";
import {IconEdit} from "../../icon";
import MrForm from "../../forms/mr/mr";

class MrModal extends Component{
  constructor(props) {
    super(props);
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
    return ( <>
      <div style={{marginRight:"5px"}}>
        <CButton size="sm" color="info"
                 style={{float: "left"}}
                 onClick={this.toggle}>
          <IconEdit />
        </CButton>
        <Modal size="md" isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle} close={closeBtn}>Edit MR</ModalHeader>
          <ModalBody>
            <MrForm
              stateId={this.props.stateId}
              updateState={this.props.updateState}
              item={this.props.item}
              toggle={this.toggle}
            />
          </ModalBody>
        </Modal>
      </div>
      </>
    )
  }
}

export default MrModal;