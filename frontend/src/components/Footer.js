import React from 'react'
import logo from '../WW Flow.png'
import fbLogo from '../icon_facebook.png'
import twitterLogo from '../icon_twitter.png'
import linkedinLogo from '../icon_linkedin.png'
import { Container, Row, Col } from 'react-bootstrap'

export default function Footer() {
  return (
    <Container className="fixed-bottom" style={{ padding: "10px",background: "#F1F6FA", marginLeft: "0px", maxWidth: "100%" }} fluid >
        <Row>
            <Col className='col-md-10'>
                <a href='/' style={{marginLeft: "15px"}}>
                    <img src={logo} style={{height: "28px", width: "150px"}} alt="Logo"/>
                </a>
                <a href='/about-us' style={{marginLeft: "25px", textDecoration: 'none'}}>
                    About Us
                </a>
            </Col>
            <Col>
                <a href='/' style={{marginLeft: "15px"}}>
                    <img src={fbLogo} style={{height: "40px", width: "40px"}} alt="FacebookLogo"/>
                </a>
                <a href='/' style={{marginLeft: "15px"}}>
                    <img src={twitterLogo} style={{height: "40px", width: "40px"}} alt="TwitterLogo"/>
                </a>
                <a href='/' style={{marginLeft: "15px"}}>
                    <img src={linkedinLogo} style={{height: "40px", width: "40px"}} alt="LinkedInLogo"/>
                </a>
            </Col>
        </Row>
    </Container>
  )
}
