import React, {useEffect} from 'react'
import { Container, Button, Form, Row, Col } from 'react-bootstrap'
import SearchBar from './SearchBar/SearchBar'

export default function LoginPage() {
  useEffect(() => {
    document.title = 'UW Wave - Login';
  }, []);

  return (
    <Container style={{display: "flex", alignItems: "center", justifyContent: "center", height: "80vh"}}>
      <Row>
        <Col style={{marginRight: "100px"}}>
          <p className="text-primary" style={{fontSize: "30px", fontWeight: "bold"}}>
            Login
          </p>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter Waterloo email" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Text>
                New to WW Flow? Use your Waterloo email to login.
              </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </Col>
        <Col style={{marginLeft: "100px"}}>
          <p className="text-primary" style={{fontSize: "30px", fontWeight: "bold"}}>
            Explore thousands of jobs, companies, salaries and reviews from WaterlooWorks
          </p>
          <SearchBar />
        </Col>
      </Row>
    </Container>
  )
}
