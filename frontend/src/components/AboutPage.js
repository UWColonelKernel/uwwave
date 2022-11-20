import React from 'react'
import { Container, Button, Form, Row, Col } from 'react-bootstrap'
import { useState, useEffect } from 'react';

export default function SearchBar() {
  return (
    <Container>
      <Row className='justify-content-center'>
        <Col className='col-3 text-end'>
          <div className='text-primary manrope-large'> Hi! </div>
        </Col>
        <Col className='col-7 align-self-center'>
          <p className='text-primary manrope-text'> 
            We're Team Colonel Kernel!
          </p>
          <p className='text-primary manrope-text'> 
            uwWave is our SE390 project that we're considering to pursue as our Capstone.
          </p>
          <div className='text-primary manrope-text'> 
            Currently, we consist of 6 students in SE24: <br/>
            Andrew D, Yiwei Z, William Q, Linda J, Michelle W, and Bryan L.
          </div>
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Col className='bg-primary text-white col-10'>
          <h2 className='manrope-title'>Feedback:</h2>
          <p className='manrope-text'> 
            If you have any feedback, questions, or concerns about Wave, 
            <br></br>
            Please contact us at teamcolonelkernel@gmail.com or use the form below
          </p>
        </Col>
      </Row>
      <Row className='justify-content-center' style={{marginTop: "50px"}}> 
        <Col className="col-10">
        <Form className='text-primary manrope-text'>
          <Form.Group className='mb-3' controlID='formBasicName'>
            <Form.Label>Name</Form.Label>
            <Form.Control type='text' placeholder='Your Name'></Form.Control>
          </Form.Group>
          <Form.Group className='mb-3' controlID='formBasicEmail'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control type='email' required placeholder='youremail@example.com'></Form.Control>
          </Form.Group>

          <Form.Group className='mb-3' controlID='formBasicEmailText'>
            <Form.Label>Contents</Form.Label>
            <Form.Control as='textarea' rows={10} required></Form.Control>
          </Form.Group>

          <Button type="submit">Submit</Button>
        </Form>
        </Col>
      </Row>
    </Container>
  )
}