import { useEffect, useState }from "react";
import { useParams } from "react-router-dom";
import { convertRawJobForJobPage } from "util/extension_adapter";
import { buildExtensionApiListener } from "util/extension_api";
import { JobPage } from "../components/JobPage/JobPage";
import axios from 'axios';

export const Job = () => {
    const { jobId } = useParams();
    const [data, setData] = useState({});
    const [imageURL, setImageURL] = useState("");

    function getJobRawCallback(resp) {
        setData(convertRawJobForJobPage(resp));
        const name = resp["Company Information"]["Organization"];
        axios.get(`https://842gb0w279.execute-api.ca-central-1.amazonaws.com/items/${name}`)
            .then((res) => {
                console.log(res);
                setImageURL(res.data["Item"]["logo"]);
            })
            .catch((err) => console.error(err));
    }

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
    }, [jobId]);

    const getCompanyCard = () => {
        if (Object.keys(data).length === 0) return {};
        return {
            imageURL: imageURL,
            companyName: data["companyName"],
            positionTitle: data["positionTitle"],
            jobOpenings: data["jobOpenings"]
        };
    }
    const getTextBody = () => {
        if (Object.keys(data).length === 0) return [];

        const textBody = []
        if (data["jobSummary"]) {
            textBody.push({
                title: "Job Summary",
                text: data["jobSummary"]
            });
        }
        if (data["jobResponsibilities"]) {
            textBody.push({
                title: "Job Responsibilities",
                text: data["jobResponsibilities"]
            });
        }
        if (data["requiredSkills"]) {
            textBody.push({
                title: "Required Skills",
                text: data["requiredSkills"]
            });
        }
        if (data["compensation"]) {
            textBody.push({
                title: "Compensation and Benefits",
                text: data["compensation"]
            });
        }
        return textBody;
    }

    return (
        <JobPage
            companyCard={getCompanyCard()}
            textBody={getTextBody()}
            shortlistHref="/"
            applyHref={`https://waterlooworks.uwaterloo.ca/myAccount/co-op/coop-postings.htm?ck_jobid=${jobId}`}
        />
    )
}   