import React from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import logo from '../logo/logo_text_3.png'

export default function NavigationBar() {
  return (
    <Navbar expand="lg" style={{marginLeft: "25px"}}>
      <Navbar.Brand href="/">
        <img src={logo} style={{height: "60px", width: "230px"}} alt="Logo"/>
      </Navbar.Brand>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
{/*           <Nav.Link href="/dashboard" className="text-primary">Dashboard</Nav.Link>
          <Nav.Link href="/trending" className="text-primary">Trending</Nav.Link> */}
          <Nav.Link href="/companies" className="text-primary">Companies</Nav.Link>
          <Nav.Link href="/jobs" className="text-primary">Jobs</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
