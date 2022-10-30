import React from 'react'
import { Form, Button } from 'react-bootstrap'

export default function SearchBar() {
  return (
    <Form className="d-flex" style={{marginBottom: "10px"}}>
        <Form.Control
            type="search"
            placeholder="Search"
            className="me-2"
            aria-label="Search"
        />
        <Button variant="outline-primary">Search</Button>
    </Form>
  )
}
