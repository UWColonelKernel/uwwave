import Paper from '@mui/material/Paper';
import styled from "styled-components"
import { Typography } from "../MUI/Typography";
import { Spacer } from "../Spacer/Spacer";
import { Star } from "../icons/Star";
import { Color } from '../../styles/color';

export const CompanyCard = ({
    imageURL,
    companyName,
    positionTitle,
    reviewCount,
    ratingValue,
    subtitle,
    isOutlined
}) => {
    return (
        <MainWrapper variant={isOutlined ? "outlined" : "elevation"} elevation={0}>
            <ImageWrapper src={imageURL}/>
            <Spacer width={8}/>
            <NameWrapper>
                {reviewCount ? <Typography variant="subtitle2" > {`${reviewCount} Reviews`}</Typography> : null}
                {positionTitle ? <Typography fontWeight="bold">{positionTitle}</Typography> : null}
                <Typography fontWeight={!positionTitle ? "bold" : "initial"}>{companyName}</Typography>   
            </NameWrapper>
            <StarsColumnWrapper>
                {ratingValue ? <StarsWrapper>
                    <Star width={32} height={32}/>
                    <Typography color={Color.primary} fontWeight={!positionTitle ? "bold" : "initial"}>{ratingValue}</Typography>   
                </StarsWrapper> : null
                }
            </StarsColumnWrapper>
            {subtitle ? <Subtitle isOutlined={isOutlined}>{subtitle}</Subtitle> : null}
        </MainWrapper>
    );  
}

const MainWrapper = styled(Paper)`
    & {
        display: flex;
        padding: ${props=>props.isOutlined ? `16px` : "0px"};
        position: relative;
    }
`

const ImageWrapper = styled.img`
    width: 80px;
    height: 80px;
    border: 1px solid black;
`

const NameWrapper = styled.div`
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    flex: 1;
`

const StarsColumnWrapper = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
`

const StarsWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`

const Subtitle = styled(Typography).attrs({variant: "subtitle2"})`
    position: absolute;
    bottom: ${props=>props.isOutlined ? `16px` : "0px"};
    right: ${props=>props.isOutlined ? `16px` : "0px"};
`