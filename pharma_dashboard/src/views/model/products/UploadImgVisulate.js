import React from "react";
import { NotificationManager } from 'react-notifications';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert, Label, } from 'reactstrap';
import { UploadImgVis } from "src/api/products/bulkUploads/bulkupload";
const { useState } = React;


function UploadImages(props) {

  const { buttonLabel, className } = props;
  const [modal, setModal] = useState(false);
  const [imgType, SetImgType] = useState("IMG")
  const [files, setFiles] = useState([]);
  const [filesUrl, setFilesUrls] = useState([]);

  const toggle = () => setModal(!modal);

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
    let selectedImg = [];
    for (let i = 0; i < e.target.files.length; i++) {
      let file = e.target.files[i];
      selectedImg.push(file);
      let metadata = getFileMetadata(file);
      let url = URL.createObjectURL(file);
      newstate = [...newstate, { url, metadata }];
    }
    setFiles(newstate);
    setFilesUrls(selectedImg)
  };

  // -----------------------UPLOAD FUNCTION-----------------------------

  const onUpload = async () => {
    if (filesUrl.length === 0) {
      return NotificationManager.error("Please Select Images", "Success", 2000);
    }
    let rs = await UploadImgVis({
      productImages: filesUrl,
      imagesType: imgType,
    });
    if (rs.success === true) {
      NotificationManager.success("Upload SuccessFully", "Success", 2000);
      props.updateState(true)
    }
    else {
      NotificationManager.error(rs.message, "Error", 2000);
    }
    toggle();
    setFiles([])
  };

  // -----------------------USEEFFECTS FUNCTION-----------------------------

  return (
    <div>
      <button className="btn-cstm" onClick={toggle}>{buttonLabel}</button>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Upload Images & Visulate</ModalHeader>
        <ModalBody>
          <Label for="exampleSelect">Select Images</Label><br />
          <input type="file" accept="image/*" multiple onChange={handleUpload} />
          <div container style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
            {files.map(f => {
              return (
                <>
                  {files.length < 50 ? <img src={f.url} alt='products' height="80" width="80" /> :
                    <img src={f.url} alt='products' height="30" width="30" />
                  }
                </>
              );
            })}
          </div>
          <Label style={{ marginTop: "20px" }} for="exampleSelect">Select Type</Label><br />
          <div className="form-check form-check-inline">
            <input className="form-check-input" checked={imgType === 'IMG'}
              onChange={(e) => SetImgType(e.target.value)} type="radio" name="inlineRadioOptions" id="inlineRadio1" value="IMG" />
            <label className="form-check-label" >Image</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" checked={imgType === 'VIS'} onChange={(e) => SetImgType(e.target.value)} type="radio" name="inlineRadioOptions" id="inlineRadio2" value="VIS" />
            <label className="form-check-label" >Visulate</label>
          </div>
          <Alert style={{ marginTop: "10px" }} color="warning">
            <b>Warning - </b> make sure your Image/Visulate name is same as your product name or
            product name should end with "#" for eg : Product.jpg , Product #1.jpg, Product #2.jpg
          </Alert>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onUpload}>Upload</Button>{' '}
          <Button color="danger" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>

  );
}
export default UploadImages
