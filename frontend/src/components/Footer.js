import React from 'react'
import logo from '../WW Flow.png'
import { Container, Row, Col } from 'react-bootstrap'

export default function Footer() {
  return (
    <Container style={{ padding: "20px",background: "#F1F6FA", marginLeft: "0px", maxWidth: "100%" }} fluid >
        <Row>
            <Col className='col-md-10'>
                <a href='/' style={{marginLeft: "15px"}}>
                    <img src={logo} style={{height: "35px", width: "200px"}}/>
                </a>
                <a href='/about-us' className='align-bottom' style={{marginLeft: "30px", textDecoration: 'none'}}>
                    About Us
                </a>
            </Col>
        </Row>
    </Container>
  )
}
