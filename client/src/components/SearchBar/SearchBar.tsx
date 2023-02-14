import React from 'react'
import { Button } from 'components/MUI/Button'
import SearchIcon from '@mui/icons-material/Search'
import TextField from '@mui/material/TextField'
import styled from 'styled-components'

interface ISearchBar<T> {
  width?: string // css string
  minWidth?: string // css string
  listItems: T[]
  Component: (props: T) => JSX.Element // should take listItem's type as props
  onSearchValChange: (val: string) => void // val is the value of the search field
}

export const SearchBar = <T extends any>(props: ISearchBar<T>) => {
  const { width, minWidth, listItems, Component, onSearchValChange } = props
  return (
    <MainWrapper width={width} minWidth={minWidth}>
      <form>
        <SearchInputWrapper>
          <StyledTextField
            placeholder="Search"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onSearchValChange(event.target.value)
            }}
          />
          <StyledButton variant="outline-primary">
            <SearchIcon />
          </StyledButton>
        </SearchInputWrapper>
      </form>
      {listItems?.length && Component ? (
        <ListWrapper>
          {listItems.map((item, i) => (
            <Component key={i} {...(item as any)} />
          ))}
        </ListWrapper>
      ) : null}
    </MainWrapper>
  )
}

const StyledTextField = styled(TextField)`
  flex: 1;
  background-color: white;
`
const SearchInputWrapper = styled.div`
  display: flex;
  width: 100%;
`

interface IMainWrapper {
  width?: string
  minWidth?: string
}
const MainWrapper = styled.div<IMainWrapper>`
  width: ${props => props.width ?? 'initial'};
  min-width: ${props => props.minWidth ?? '300px'};
  position: relative;
`
const StyledButton = styled(Button)`
  && {
    position: relative;
    right: 4px;
    border-radius: 0 4px 0 0;
  }
`

const ListWrapper = styled.div`
  width: calc(100% - 4px);
  position: absolute;
  border-right: 1.6px solid #bbb;
  border-bottom: 1.6px solid #bbb;
  border-radius: 0px 0px 4px 0px;
`
