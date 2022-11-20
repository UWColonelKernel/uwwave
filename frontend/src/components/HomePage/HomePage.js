import React from 'react'
import Container from '@mui/material/Container';
import SearchBar from "../SearchBar"
import styled from "styled-components";
import { Spacer } from "../Spacer/Spacer";
import { Typography }from '../MUI/Typography';
import { Color } from "../../styles/color";
import { Tiles } from "./Tiles/Tiles";

export default function HomePage() {
  return (
    <>
    <HeroWrapper>
    <Hero>
      <Typography variant="h4" color={Color.primary} fontWeight="bold">
        Search on UW Wave to find Jobs, Companies, and Reviews
      </Typography>
      <Spacer height={32}/>
      <SearchBar width="50%" minWidth="300px"/>
    </Hero>
    </HeroWrapper>
    <Tiles/>
    </>
  )
}

const Hero = styled(Container)`
  && {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 48px;
    padding-bottom: 48px;
    min-height: 400px;
  }
`

const HeroWrapper = styled.div`
  width: 100%;
  background-color: #F0F9FF;
`


