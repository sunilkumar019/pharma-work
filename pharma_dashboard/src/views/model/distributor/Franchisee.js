import React, { useState, useEffect } from 'react';
import { Modal} from 'reactstrap';
import { GetFranchisee } from 'src/api/distributor/franchisee';
import modal_img from '../../../assets/images/modal_img.jpg'

const ModalExample = (props) => {
  const { buttonLabel, franchiseeId} = props;
  const [modal, setModal] = useState(false);
  const [Data, setData] = useState({})
  const myStyle =  {color:"#4285F4", fontWeight : "400"}
  const toggle = () => setModal(!modal);

  useEffect(() => {
    const fetchMyAPI = async() => {
        let rs = await GetFranchisee({
            id : franchiseeId
        })
        if (rs.success === true){
            setData(rs.data)
        }
    }
    if(modal === true) {
        fetchMyAPI()
    }
  }, [modal, franchiseeId])

  return (
    <div>
      
    <span style={{cursor : "pointer"}}><b style={{color:"#4277ff"}}  onClick={toggle}>{buttonLabel}</b></span>
      <Modal isOpen={modal} toggle={toggle} >
        <div id="container_modal">
          <div className="product-details">
            <h1>Franchisee Information</h1>
            <span className="hint-star star">
              <i className="fa fa-star" aria-hidden="true"></i>
              <i className="fa fa-star" aria-hidden="true"></i>
              <i className="fa fa-star" aria-hidden="true"></i>
              <i className="fa fa-star" aria-hidden="true"></i>
              <i className="fa fa-star-o" aria-hidden="true"></i>
            </span>
            <p className="information">
            <p><span style={myStyle}><b><i className="fas fa-user">&nbsp;</i>Name : &nbsp; </b></span> <b>{Data.name}</b> </p>
              <p><span style={myStyle}><b><i className="fas fa-phone-square-alt">&nbsp;</i>Phone : &nbsp;</b></span><b>{Data.phone}</b></p>
              <p><span style={myStyle}><b><i className="fas fa-envelope">&nbsp;</i>Email : &nbsp;</b></span> <b>{Data.email}</b></p>
              <p><span style={myStyle}><b><i className="fas fa-home">&nbsp;</i>Address : &nbsp;</b></span> <b>{Data.address}</b></p>
            </p>
          </div>
          <div className="product-image">
            <span className="close-thik" onClick={toggle}/>
            <img src={modal_img} alt="modal_img" />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ModalExample;