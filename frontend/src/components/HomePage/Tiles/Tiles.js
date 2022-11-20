import styled from "styled-components"
import { CompanyTile } from "../Tile/variants/CompanyTile";
import { JobsTile } from "../Tile/variants/JobsTile";
import { ReviewsTile } from "../Tile/variants/ReviewsTile";
import Container from '@mui/material/Container';

export const Tiles = () => {
    return (
        <Container>
            <MainWrapper>
                <CompanyTile/>
                <JobsTile/>
                <ReviewsTile/>
            </MainWrapper>
        </Container>   
    )
}

const MainWrapper = styled.div`
    display: flex;
    gap: 32px;
    padding: 40px;
    justify-content: center;
    flex-wrap: wrap;
`