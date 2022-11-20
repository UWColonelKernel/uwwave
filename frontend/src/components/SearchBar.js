import React from 'react'
import { Form, Button } from 'react-bootstrap'

export default function SearchBar(props) {
  return (
    <Form className="d-flex" style={
      {
        marginBottom: "10px", 
        width: props.width ?? "initial",
        minWidth: props.minWidth ?? "initial",
      }
      }>
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
