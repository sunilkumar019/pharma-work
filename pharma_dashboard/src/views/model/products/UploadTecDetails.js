import React, { useState } from "react";
import { NotificationManager } from "react-notifications";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
} from "reactstrap";
import { TechDetails } from "src/api/products/bulkUploads/bulkupload";

const UploadTechDetails = (props) => {
  const {  className } = props;
  const [modal, setModal] = useState(false);
  const [file, setFile] = useState("");
  // const [products, setProducts] = useState([]);
  const[selectedFile, setSelectedFile] = useState([]);
  const toggle = () => setModal(!modal);

  // -----------------------UPLOAD FUNCTION-----------------------------
  
  const onUpload = async () => {
    if (file === "") {
      return NotificationManager.error("Please Select Csv File", "Error");
    }
    else {
      let rs = await TechDetails({
        productFile: selectedFile,
      });
      if (rs.success === true) {
        NotificationManager.success("Upload SuccessFully", "Success");
        props.updateState(true)
      } else {
        NotificationManager.error(rs.message, "Error");
      }
      toggle();
    }
  };

    // -----------------------GET METADATA FUNCTION-----------------------------


  const getFileMetadata = (file) => {
    return {
      lastModified: file.lastModified,
      name: file.name,
      size: file.size,
      type: file.type,
      webkitRelativePath: file.webkitRelativePath,
    };
  };

  // -----------------------ONCHANGE FUNCTION-----------------------------

  const handleUpload = (e) => {
    let newstate = [];
    let selectedFile = [];
    for (let i = 0; i < e.target.files.length; i++) {
      let file = e.target.files[i];
      selectedFile.push(file)
      let metadata = getFileMetadata(file);
      let url = URL.createObjectURL(file);
      newstate = [...newstate, { url, metadata }];
    }
    setSelectedFile(selectedFile)
    setFile(newstate);
  };


  return (
    <div>
      <button className="btn-cstm"  onClick={toggle}>
      Upload Technical Details
      </button>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Upload Technical Details</ModalHeader>
        <ModalBody>
          <input
            type="file"
            id="docpicker"
            onChange={handleUpload}
            accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
          <Alert style={{ marginTop: "10px" }} color="warning">
            <b>Warning - </b> make sure you are uploading file in "Docx" Format
          </Alert>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onUpload}>
            Upload
          </Button>{" "}
          <Button color="danger" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default UploadTechDetails;
