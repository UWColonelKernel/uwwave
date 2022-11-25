import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { convertRawJobForJobPage } from "util/extension_adapter";
import { buildExtensionApiListener } from "util/extension_api";
import { JobPage } from "../components/JobPage/JobPage";
import axios from 'axios';
const DUMMY_DESCRIPTION = [
    {
        title: "Job responsibilites",
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non dui sit amet neque viverra sollicitudin. Nulla sagittis malesuada magna. Ut scelerisque, urna a bibendum ullamcorper, augue ipsum semper metus, et eleifend turpis ante vel diam. Phasellus semper lacus tortor, quis rutrum lectus cursus sed. Nunc dictum dignissim lobortis. Sed sit amet placerat dui. Nam ullamcorper a tellus id lobortis. Integer fermentum vel urna nec posuere.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non dui sit amet neque viverra sollicitudin. Nulla sagittis malesuada magna. Ut scelerisque, urna a bibendum ullamcorper, augue ipsum semper metus, et eleifend turpis ante vel diam. Phasellus semper lacus tortor, quis rutrum lectus cursus sed. Nunc dictum dignissim lobortis. Sed sit amet placerat dui. Nam ullamcorper a tellus id lobortis. Integer fermentum vel urna nec posuere. `
    },
    {
        title: "Salary",
        text: "$50/h"
    },
    {
        title: "Compensation",
        text: "$1500 montly stipend"
    }
]

const DUMMY_COMPANY_CARD = {
    imageURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png",
    companyName:"Google",
    reviewCount:52,
    ratingValue:4.8,
    subtitle:"Available Jobs Mention: Software Engineering",
    positionTitle:"Software Engineering Intern"
}

export const Job = () => {
    const { jobId } = useParams();
    const [data, setData] = useState({});
    const [imageURL, setImageURL] = useState("");


    useEffect(() => {
        const receiveExtensionMessage = buildExtensionApiListener({
            "get_job_raw": { 
              callback: (resp) => {
                setData(convertRawJobForJobPage(resp));
                const name = resp["Company Information"]["Organization"];
                axios.get(`https://842gb0w279.execute-api.ca-central-1.amazonaws.com/items/${name}`)
                    .then((res) => {
                        console.log(res);
                        setImageURL(res.data["Item"]["logo"]);
                    })
                    .catch((err) => console.error(err));
                    

              },
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
    }, []);

    // const comapnyCard = 
    // {
    //     companyName: data["Company Information"]["Organization"],
    //     positionTitle: data["Job Posting Information"]["Job Title"],
    //     jobOpenings: data["Job Posting Information"]["Job Title"]
    // }
    // const JobDescrptionCard =
    // [
    //     {
    //         title: "Job Summary",
    //         text: data["Job Posting Information"]["Job Summary"]
    //     },
    //     {
    //         title: "Job Responsibilites",
    //         text: data["Job Posting Information"]["Job Responsibilites"]
    //     },
    //     {
    //         title: "Required Skills",
    //         text: data["Job Posting Information"]["Required Skills"]
    //     },
    //     {
    //         title: "Compensation and Benefits",
    //         text: data["Job Posting Information"]["Compensation and Benefits"]
    //     }
    // ]
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