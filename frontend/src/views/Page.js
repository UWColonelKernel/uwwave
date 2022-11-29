import { useCallback, useEffect, useState }from "react";
import { useParams } from "react-router-dom";
import { convertRawJobForJobPage } from "util/extension_adapter";
import { buildExtensionApiListener } from "util/extension_api";
import { JobPage } from "../components/JobPage/JobPage";
import axios from 'axios';
import defaultIcon from '../components/icons/companyDefaultLogo.png'

export const Job = () => {
    const { jobId } = useParams();
    const [companyCard, setCompanyCard] = useState({});
    const [textBody, setTextBody] = useState([]);
    const [extraInfo, setExtraInfo] = useState([]);
    const [imageURL, setImageURL] = useState("");

    // use callback to prevent reupdating the function every time the component is rerendered
    const getJobRawCallback = useCallback((resp) => {
        const parsedData = convertRawJobForJobPage(resp);
        setCompanyCard(getCompanyCard(parsedData));
        setTextBody(getTextBody(parsedData));

        const name = parsedData.companyName;
        axios.get(`https://842gb0w279.execute-api.ca-central-1.amazonaws.com/items/${name}`)
            .then((res) => {
                if (res.data["Item"]) {
                    setImageURL(res.data["Item"]["logo"]);
                    
                    const dashIndex = res.data["Item"]["salary"].indexOf('-');
                    let salary = '$' + res.data["Item"]["salary"];
                    if (dashIndex >= 0) salary = salary.slice(0, dashIndex + 2) + '$' + salary.slice(dashIndex + 2);
                    if (res.data["Item"]["Currency"]) salary += " " + res.data["Item"]["Currency"];

                    setExtraInfo([
                        {
                            title: "Salary",
                            text: salary
                        },
                        {
                            title: "Company Website",
                            text: "<a href=//" + res.data["Item"]["domain"] + " target='_blank'>" + res.data["Item"]["domain"] + "</a>"
                        }
                    ]);
                } else {
                    setImageURL(defaultIcon);
                }
            })
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        const receiveExtensionMessage = buildExtensionApiListener({
            "get_job_raw": { 
              callback: getJobRawCallback,
              req: {
                jobid: jobId
              }
            }
          });

        window.addEventListener("message", receiveExtensionMessage, false);
        // Specify how to clean up after this effect:
        return function cleanup() {
            window.removeEventListener("message", receiveExtensionMessage);
        };
    }, [jobId, getJobRawCallback]);

    const getCompanyCard = (parsedData) => {
        if (Object.keys(parsedData).length === 0) return {};
        return {
            companyName: parsedData["companyName"],
            positionTitle: parsedData["positionTitle"],
            jobOpenings: parsedData["jobOpenings"]
        };
    }
    const getTextBody = (parsedData) => {
        if (Object.keys(parsedData).length === 0) return [];
        
        const currTextBody = [];
        if (parsedData["jobSummary"]) {
            currTextBody.push({
                title: "Job Summary",
                text: parsedData["jobSummary"]
            });
        }
        if (parsedData["jobResponsibilities"]) {
            currTextBody.push({
                title: "Job Responsibilities",
                text: parsedData["jobResponsibilities"]
            });
        }
        if (parsedData["requiredSkills"]) {
            currTextBody.push({
                title: "Required Skills",
                text: parsedData["requiredSkills"]
            });
        }
        if (parsedData["compensation"]) {
            currTextBody.push({
                title: "Compensation and Benefits",
                text: parsedData["compensation"]
            });
        }
        return currTextBody;
    }

    return (
        <JobPage
            companyCard={{...companyCard, imageURL}}
            textBody={[...textBody, ...extraInfo]}
            shortlistHref="/"
            applyHref={`https://waterlooworks.uwaterloo.ca/myAccount/co-op/coop-postings.htm?ck_jobid=${jobId}`}
        />
    )
}   