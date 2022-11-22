import React from 'react'
import JobEntry from './JobEntry';
import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import { Container, Row, Col } from 'react-bootstrap';
import { Pagination } from 'react-bootstrap';

export default function JobsPage() {
    const [data, setData] = useState([
        {
            id: 1,
            companyName: "Apple",
            jobName: "Software Engineer Intern"
        },
        {
            id: 2,
            companyName: "Apple",
            jobName: "Machine Learning Engineer Intern"
        },
        {
            id: 3,
            companyName: "Apple",
            jobName: "Data Scientist Intern"
        },
        {
            id: 4,
            companyName: "Apple",
            jobName: "Watch System Tool Engineer Intern"
        },
        {
            id: 5,
            companyName: "Amazon",
            jobName: "Software Engineering Intern"
        },
        {
            id: 6,
            companyName: "Datadog",
            jobName: "Product Design Intern"
        },
        {
            id: 7,
            companyName: "Datadog",
            jobName: "Software Engineering Intern"
        },
        {
            id: 8,
            companyName: "Microsoft",
            jobName: "Software Engineering Intern"
        }
    ]);

    const [extensionRawData, setExtensionRawData] = useState({});

    const receiveExtensionMessage = (event) => {
        // We only accept messages from ourselves
        if (event.source !== window) {
            return;
        }
        if (!event.data.type) {
            return;
        }

        if (event.data.type === "WWFLOW_EXT_LOADED") {
            console.log("React app received: " + event.data.text);
            window.postMessage({ type: "WWFLOW_FROM_PAGE", req_type: "get_data", text: "Requesting data" }, "*");
        }
        if (event.data.type === "WWFLOW_EXT_RESP") {
            if (!event.data.req_type) {
                console.warn("Extension response does not contain req_type.");
                return;
            }
            if (event.data.req_type === "get_data") {
                setExtensionRawData(event.data.resp);
            }
        }
    }

    useEffect(() => {
        window.addEventListener("message", receiveExtensionMessage, false);
        // Specify how to clean up after this effect:
        return function cleanup() {
            window.removeEventListener("message", receiveExtensionMessage);
        };
    });

    useEffect(() => {
        console.log("ext raw data updated");
        console.log(extensionRawData);
        var newData = [];
        for (const [key, value] of Object.entries(extensionRawData)) {
            newData.push({
                id: key,
                companyName: value["Posting List Data"].company,
                jobName: value["Posting List Data"].jobTitle,
            })
        }
        setData(newData);
    }, [extensionRawData]);
    
    return (
        <Container >
            <SearchBar/>
            <Row className="align-items-center" style={{marginBottom: "10px"}}>
                <Col className='col-md-2 text-primary'> Company </Col>
                <Col className='col-md-10 text-primary'> Job Name </Col>
            </Row>
            {data.map((item, index) => (
                <JobEntry companyName={item.companyName} jobName={item.jobName} key={item.id}></JobEntry>
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
