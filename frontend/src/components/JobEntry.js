import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'

export default function (props) {
  return (
    <Container style={{border: "1px solid blue", borderRadius: "5px", padding: "5px", marginTop: "2px", marginBottom: "2px"}}>
        <Row className="align-items-center">
            <Col className='col-md-2' style={{fontWeight: "bold"}}> {props.companyName} </Col>
            <Col className='col-md-8'>{props.jobName} </Col>
            <Col className='col-md-1'>            
                <Button variant="primary">
                    Shortlist
                </Button>
            </Col>
            <Col className='col-md-1'>            
                <Button variant="primary">
                    Apply
                </Button>
            </Col>
        </Row>
    </Container>
  )
}
