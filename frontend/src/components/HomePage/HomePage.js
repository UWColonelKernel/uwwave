import React, {useEffect, useState} from 'react';
import Container from '@mui/material/Container';
import SearchBar from "../SearchBar/SearchBar"
import styled from "styled-components";
import { Spacer } from "../Spacer/Spacer";
import { Typography }from '../MUI/Typography';
import { Color } from "../../styles/color";
import { Tiles } from "./Tiles/Tiles";

//EXMAPLE OF SEARCH BAR COMPONENT PROPS
//TODO: Replace
const DUMMY_ITEMS = [
  {
    title: "Microsoft"
  },
  {
    title: "Apple"
  },
  {
    title: "Mcdonalds"
  },
]

const DummyListItem = (props) => {
  const {
    title
  } = props;
  return (
    <ListItemWrapper>
      <Typography>{title}</Typography>
    </ListItemWrapper>
  )
}

const ListItemWrapper = styled.div`
  width: 100%;
  padding: 16px;
  display: flex;
  background-color: white;
`
//END OF DUMMY SEARCH BAR PROPS

export default function HomePage() {
  useEffect(() => {
    document.title = 'UW Wave';
  }, []);

  const [searchListItems, setSearchListItems] = useState([]);

  const onSearchValChange = (val) => {
    if(val){
      setSearchListItems(DUMMY_ITEMS.filter(item=>item.title.toUpperCase().includes(val.toUpperCase())))
    }else{
      setSearchListItems([]);
    }
  }

  return (
    <>
    <HeroWrapper>
    <Hero>
      <Typography variant="h4" color={Color.primary} fontWeight="bold">
        Search on UW Wave to find Jobs, Companies, and Reviews
      </Typography>
      <Spacer height={32}/>
      <SearchBar
        width="50%"
        listItems={searchListItems}
        Component={DummyListItem}
        onSearchValChange={onSearchValChange}
      />
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
