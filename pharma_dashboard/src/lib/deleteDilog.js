import React from "react";
import { Modal, ModalBody} from 'reactstrap';
import { ModalContext } from "./context";

const ConfirmDelete = () => {
    const btnStyle = { borderRadius: "300px" }
    return (
        <ModalContext.Consumer>
            {context => {
                if (context.showModal) {
                    return (
                        <Modal isOpen={context.showModal}  >
                            <ModalBody style={{ textAlign: "center" }}>
                                <i style={{ fontSize: "65px", color: "red" }} className="fas fa-exclamation-triangle"></i> <br />
                                <h4 style={{ paddingTop: "20px", fontWeight: "400" }}><b>Confirm Permanent Deletion</b></h4>   <br />
                                { context.title ?
                                    <p>
                                        { context.title }
                                        Once deleted permanently. they cannot be recovered
                                    </p> :
                                    <p>
                                        Are you sure to delete the selected items permanently?
                                        Once deleted permanently. they cannot be recovered
                                    </p>
                                }
                                <button style={btnStyle} onClick={() => context.deleteItem(context.id)} className="delete_btn">Delete</button>
                                <button style={btnStyle} onClick={context.toggleModal} className="cancel_btn">Cancel</button>
                            </ModalBody>
                        </Modal>
                    );
                }
                return null;
            }}
        </ModalContext.Consumer>
    );
};

export default ConfirmDelete;