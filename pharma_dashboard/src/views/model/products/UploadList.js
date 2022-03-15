import React, { useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';
import { UploadListCsv } from 'src/api/products/bulkUploads/bulkupload';

const ImportFromCsv = (props) => {
  const {
    buttonLabel,
    className
  } = props;

  const [modal, setModal] = useState(false);
  const [csv, setCsv] = useState("")
  const [selectedFile, setSelectedFile] = useState([]);
  const toggle = () => setModal(!modal);

  // -----------------------ONUPLOAD FUNCTION-----------------------------

  const onUpload = async () => {
    if (csv === "") {
      return NotificationManager.error('Please Select Csv File', 'Error');
    }

    if (selectedFile.length === 0 ) {
      NotificationManager.error('Please Select the file', 'Info');
    }
    else {
      let rs = await UploadListCsv({
        productFile: selectedFile
      })
      if (rs.success === true) {
        NotificationManager.success('Upload SuccessFully', 'Success');
        props.updateState(true)
      }
      else {
        NotificationManager.error(rs.message, 'Error');
        setSelectedFile([])
      }
    }
      toggle()
  }

  // -----------------------METADATA FUNCTION-----------------------------

  const getFileMetadata = file => {
    return {
      lastModified: file.lastModified,
      name: file.name,
      size: file.size,
      type: file.type,
      webkitRelativePath: file.webkitRelativePath
    }
  }

  // -----------------------ONCHANGE FUNCTION-----------------------------

  const handleUpload = e => {
    let newstate = [];
    let selectedFile = [];
    for (let i = 0; i < e.target.files.length; i++) {
      let file = e.target.files[i];
      selectedFile.push(file)
      let metadata = getFileMetadata(file);
      let url = URL.createObjectURL(file);
      newstate = [...newstate, { url, metadata }];
    }
    setCsv(newstate);
    setSelectedFile(selectedFile)
  };


  return (
    <div>
      <button  className="btn-cstm" onClick={toggle}>{buttonLabel}</button>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Import From Csv</ModalHeader>
        <ModalBody>
          <input onChange={handleUpload} type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
          <Alert style={{ marginTop: "10px" }} color="warning">
            <b>Warning - </b> make sure you are uploading file in CSV (delimiter) Format <br/>
            - Products name should not be repeted <br/>
            - Product Type , Category , Division name should avilable in Dashboard
        </Alert>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onUpload}>Import</Button>{' '}
          <Button color="danger" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ImportFromCsv;