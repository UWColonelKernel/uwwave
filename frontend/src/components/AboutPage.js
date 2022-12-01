import React, { useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Spacer } from "./Spacer/Spacer";

export default function AboutPage() {
  useEffect(() => {
    document.title = 'UW Wave - About Us';
  }, []);

  return (
    <Container>
      <Row className='justify-content-center' style={{fontSize: '1.5em'}}>
        <Col className='col-10 align-self-center'>
          <h1 className='text-primary' style={{fontWeight: 'bold'}}> 
            We're Team Colonel Kernel
          </h1>
          <p className='text-primary'> 
            UW Wave is our SE 390 project that we're considering to pursue as our capstone project.
          </p>
          <p className='text-primary'> 
            Currently, we consist of 5 students in SE24: <br/>
            Andrew D, Yiwei Z, William Q, Linda J, and Michelle W.
          </p>
        </Col>
      </Row>
      <Spacer height={32}/>
      <Row className='justify-content-center' style={{fontSize: '1.2em'}}>
        <Col className='col-10'>
          <h2 style={{fontWeight: "bold"}}>Feedback:</h2>
          <p> 
            If you have any feedback, questions, or concerns about Wave, 
            <br></br>
            Please contact us at teamcolonelkernel@gmail.com!
          </p>
        </Col>
      </Row>
    </Container>
  )
}