import React from 'react'
import logo from '../logo/logo_text_1.png'
import { Container, Row, Col } from 'react-bootstrap'

export default function Footer() {
  return (
    <Container style={{ padding: "20px",background: "#F1F6FA", marginLeft: "0px", maxWidth: "100%" }} fluid >
        <Row>
            <Col className='col-md-10'>
                <a href='/' style={{marginLeft: "15px"}}>
                    <img src={logo} style={{height: "45px", width: "112.5px"}} alt="logo"/>
                </a>
                <a href='/about-us' className='align-bottom' style={{marginLeft: "30px", textDecoration: 'none', fontSize:'1.5em'}}>
                    About Us
                </a>
            </Col>
        </Row>
    </Container>
  )
}
