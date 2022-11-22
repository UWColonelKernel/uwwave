import { JobPage } from "../components/JobPage/JobPage";

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

//TODO: change to use api request

export const Job = () => {
    return (
        <JobPage
            textBody={DUMMY_DESCRIPTION}
            companyCard={DUMMY_COMPANY_CARD}
            shortlistHref="/"
            applyHref="/"
        />
    )
}   