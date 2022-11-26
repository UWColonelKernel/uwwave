import React from 'react'
import { Button } from "components/MUI/Button"
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import styled from "styled-components"

// interface ISearchPar{
//   width: string, //css string
//   minWidth: string //css string
//   listItems: any[],
//   Component: React.FC<any> //should take listItem's type as props
//   onSearchValChange : (val: string)=>{} // val is the value of the search field
// }

export default function SearchBar(props) {
  const {
    width,
    minWidth,
    listItems,
    Component,
    onSearchValChange 
  } = props;
  return (
    <MainWrapper width={width} minWidth={minWidth}>
      <form>
    <SearchInputWrapper >
        <StyledTextField
          placeholder="Search"
          onChange={(event)=>{
            onSearchValChange(event.target.value);
          }}
        />
        <StyledButton variant="outline-primary"><SearchIcon/></StyledButton>
    </SearchInputWrapper>
    </form>
    {listItems?.length && Component ? <ListWrapper>
      {
        listItems.map((item, i)=>(
          <Component key={i} {...item}/>
        ))
      }
    </ListWrapper> : null}
    </MainWrapper>
  )
}

const StyledTextField = styled(TextField)`
  flex: 1;
  background-color: white;
  margin-right: -4px !important;
`
const SearchInputWrapper = styled.div`
  display: flex;
  width: 100%;
`
const MainWrapper = styled.div`
  width: ${props=>props.width ?? "initial"};
  min-width: ${props=>props.minWidth ?? "300px"};
  position: relative;
`
const StyledButton = styled(Button)`
  && {
    position: relative;
    border-radius: 0 4px 0 0;
  }
`

const ListWrapper = styled.div`
  width: 100%;
  position: absolute;
  border-right: 1.6px solid #bbb;
  border-bottom: 1.6px solid #bbb;
  border-radius: 0px 0px 4px 0px;
`
