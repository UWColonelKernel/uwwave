import React from 'react'
import JobEntry from './JobEntry';
import { useState } from 'react';
import SearchBar from './SearchBar';
import { Container, Row, Col } from 'react-bootstrap';
import { Pagination } from 'react-bootstrap';

export default function JobsPage() {
    const [data, setData] = useState([
        {
            companyName: "Apple",
            jobName: "Software Engineer Intern"
        },
        {
            companyName: "Apple",
            jobName: "Machine Learning Engineer Intern"
        },
        {
            companyName: "Apple",
            jobName: "Machine Learning Engineer Intern"
        },
        {
            companyName: "Apple",
            jobName: "Data Scientist Intern"
        },
        {
            companyName: "Apple",
            jobName: "Watch System Tool Engineer Intern"
        },
        {
            companyName: "Amazon",
            jobName: "Software Engineering Intern"
        },
        {
            companyName: "Datadog",
            jobName: "Product Design Intern"
        },
        {
            companyName: "Datadog",
            jobName: "Software Engineering Intern"
        },
        {
            companyName: "Microsoft",
            jobName: "Software Engineering Intern"
        }
    ]);
    
   return (
    <Container >
        <SearchBar/>
        <Row className="align-items-center" style={{marginBottom: "10px"}}>
            <Col className='col-md-2 text-primary'> Company </Col>
            <Col className='col-md-10 text-primary'> Job Name </Col>
        </Row>
        {data.map((item, index) => (
            <JobEntry companyName={item.companyName} jobName={item.jobName}></JobEntry>
        ))}
        <Pagination style={{ marginTop: "10px", display: "flex", justifyContent:"center"}}>
            <Pagination.First />
            <Pagination.Prev />
            <Pagination.Item active>{1}</Pagination.Item>
            <Pagination.Item>{2}</Pagination.Item>
            <Pagination.Item>{3}</Pagination.Item>
            <Pagination.Item>{4}</Pagination.Item>
            <Pagination.Item>{5}</Pagination.Item>
            <Pagination.Item>{6}</Pagination.Item>
            <Pagination.Ellipsis />
            <Pagination.Next />
            <Pagination.Last />
        </Pagination>
    </Container>
  )
}
