import React from "react";
import dashboard from '../../../assets/images/dashboard.png'
import mobile from '../../../assets/images/mobile.png'
import mr from '../../../assets/images/mr.png'
import {Card, CardBody, CardHeader, Button, CardText, Col, Row} from "reactstrap";

const Download = () => {

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  return (
      <Row>
        <Col md="4">
          <Card>
            <CardHeader className='p-0'>
              <img className="card-img-top" src={dashboard} alt="dashboard"/>
            </CardHeader>
            <CardBody className='text-center'>
              <h5 className='pink-text'>
                <i className='fas fa-desktop'></i> Dashboard Guide
              </h5>
              <h3 className='font-weight-bold'>
                About
              </h3>

              <CardText>
                Dashboards are a collection of widgets and Tables that give you an overview of your
                company information.
              </CardText>

              <Col md="12" className="d-flex justify-content-center">
                <Button size={'sm'} style={{fontSize: 13, padding:7, borderRadius: 3, border: "1px solid #321FDB" }} color="primary" onClick={() => openInNewTab('https://drive.google.com/file/d/1XC7oPinTi7pI-tc2UCF29h25OHhSYiUs/view')}>Download</Button>
              </Col>
            </CardBody>
          </Card>
        </Col>
        <Col md="4">
          <Card>
            <CardHeader className='p-0'>
              <img className="card-img-top" src={mobile} alt="mobile"/>
            </CardHeader>
            <CardBody className='text-center'>
              <h5 className='pink-text'>
                <i className='fas fa-mobile-alt'></i> App Guide as Distributor
              </h5>
              <h3 className='font-weight-bold'>
                About
              </h3>

              <CardText>
                An easy and beginner-friendly Guide
                to learn the basics and fundamental concepts of Android App quickly.
              </CardText>

              <Col md="12" className="d-flex justify-content-center">
                <Button size={'sm'} style={{fontSize: 13, padding:7, borderRadius: 3, border: "1px solid #321FDB" }} color="primary" onClick={() => openInNewTab('https://drive.google.com/file/d/1AP840qtlZjYJxCo-HROmLq85VPP4Wr6Y/view')}>Download</Button>
              </Col>
            </CardBody>
          </Card>
        </Col>
        <Col md="4">
          <Card>
            <CardHeader className='p-0'>
              <img className="card-img-top" src={mr} alt="mr"/>
            </CardHeader>
            <CardBody className='text-center'>
              <h5 className='pink-text'>
                <i className='far fa-id-card'></i> App Guide as MR
              </h5>
              <h3 className='font-weight-bold'>
                About
              </h3>

              <CardText>
                A simple, easy, and complete guide for Medical Representative for overview of the information of app.
              </CardText>

              <Col md="12" className="d-flex justify-content-center">
                <Button size={'sm'} style={{fontSize: 13, padding:7, borderRadius: 3, border: "1px solid #321FDB" }} color="primary" onClick={() => openInNewTab('https://drive.google.com/file/d/1JC9JbnRh9YGO8htSlWj-yL7TqDrdbs4Q/view')}>Download</Button>
              </Col>
            </CardBody>
          </Card>
        </Col>
      </Row>
  );
};

export default Download;
