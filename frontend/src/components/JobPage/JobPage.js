import {useState} from 'react';
import Container from '@mui/material/Container';
import { Typography } from "../MUI/Typography";
import { Color } from "../../styles/color";
import SearchBar from '../SearchBar';
import { Spacer } from "../Spacer/Spacer";
import { Divider } from '../MUI/Divider';
import { CompanyCard } from "../CompanyCard/CompanyCard";
import Grid from '@mui/material/Grid';
import styled from "styled-components";
import { Button } from "../MUI/Button"

const DUMMY_DESCRIPTION = [
    {
        title: "Job responsibilites",
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non dui sit amet neque viverra sollicitudin. Nulla sagittis malesuada magna. Ut scelerisque, urna a bibendum ullamcorper, augue ipsum semper metus, et eleifend turpis ante vel diam. Phasellus semper lacus tortor, quis rutrum lectus cursus sed. Nunc dictum dignissim lobortis. Sed sit amet placerat dui. Nam ullamcorper a tellus id lobortis. Integer fermentum vel urna nec posuere.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non dui sit amet neque viverra sollicitudin. Nulla sagittis malesuada magna. Ut scelerisque, urna a bibendum ullamcorper, augue ipsum semper metus, et eleifend turpis ante vel diam. Phasellus semper lacus tortor, quis rutrum lectus cursus sed. Nunc dictum dignissim lobortis. Sed sit amet placerat dui. Nam ullamcorper a tellus id lobortis. Integer fermentum vel urna nec posuere. `
    }
]
export default function JobPage() {
    const {
        primary
    } = Color;

    const [description] = useState(DUMMY_DESCRIPTION);

    const Search = () => (
        <>
            <Spacer/>
            <Typography color={primary} variant="h5" fontWeight="bold">Explore Jobs</Typography>
            <Spacer/>
            <SearchBar width="50%" minWidth="300px"/>
            <Spacer/>
        </>
    )

    const Header = () => (
        <>
        <Grid item xs={12} md={8}>
             <CompanyCard
                imageURL="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png"
                companyName="Google"
                reviewCount={52}
                ratingValue={4.8}
                subtitle="Available Jobs Mention: Software Engineering"
                positionTitle="Software Engineering Intern"
            />
        </Grid>
         <Grid item xs={12} md={4}>
            <WWButtons/>
        </Grid>
        </>
    )

    const Body = () => (
        <>
        <Grid item xs={12} md={8}>
             <Description/>
        </Grid>
         <Grid item xs={12} md={4}>

        </Grid>
        </>
    )

    const Description = () => (
        description.map(item=>(
            <div key={item.title}>
                <Typography fontWeight="bold" variant="h5">{item.title}</Typography><br/>
                {
                    item.text.split("\n").map(item2=>(
                        <DescriptionTypography key={item2}>{item2}<br/><br/></DescriptionTypography>
                    ))
                }
                
            </div>
        ))
    )

    const WWButtons = () => {
        return (
            <>
            <ButtonsWrapper>
                <ButtonsInnerWrapper>
                    <Button width={120}>Shortlist</Button>
                    <Button width={120}>Apply</Button>
                </ButtonsInnerWrapper>
                <Typography variant="subtitle2">(Takes you to WaterlooWorks)</Typography>
            </ButtonsWrapper>
            </>
        )
    }

    return(
        <Container >
            <Search/>
            <Divider color={primary}/>
            <Spacer/>
            <Grid container spacing={4}>
                <Header/>
                <Body/>
            </Grid>
           
        </Container>
    )
}

const ButtonsInnerWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 8px;
`

const ButtonsWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: end;
    justify-content: end;
    flex-direction: column;
    gap: 8px;
`

const DescriptionTypography = styled(Typography)`
    && {
        white-space: pre-line;
    }
`