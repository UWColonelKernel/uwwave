import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import styled from 'styled-components'
import { Spacer } from 'components/Spacer/Spacer'
import { Typography } from 'components/MUI/Typography'
import { Color } from 'styles/color'
import { SearchBar } from 'components/SearchBar/SearchBar'

// EXMAPLE OF SEARCH BAR COMPONENT PROPS
// TODO: Replace
interface IListItem {
  title: string
}

const DUMMY_ITEMS = [
  {
    title: 'Microsoft',
  },
  {
    title: 'Apple',
  },
  {
    title: 'Mcdonalds',
  },
]
const ListItemWrapper = styled.div`
  width: 100%;
  padding: 16px;
  display: flex;
  background-color: white;
`

interface IDummyListItem {
  title: string
}

const DummyListItem = (props: IDummyListItem) => {
  const { title } = props
  return (
    <ListItemWrapper>
      <Typography>{title}</Typography>
    </ListItemWrapper>
  )
}

// END OF DUMMY SEARCH BAR PROPS

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
  background-color: #f0f9ff;
`

export const HomePage = () => {
  useEffect(() => {
    document.title = 'UW Wave'
  }, [])

  const [searchListItems, setSearchListItems] = useState<IListItem[]>([])

  const onSearchValChange = (val: string) => {
    if (val) {
      setSearchListItems(
        DUMMY_ITEMS.filter(item =>
          item.title.toUpperCase().includes(val.toUpperCase()),
        ),
      )
    } else {
      setSearchListItems([])
    }
  }

  return (
    <>
      <HeroWrapper>
        <Hero>
          <Typography variant="h4" color={Color.primary} fontWeight="bold">
            Search on UW Wave to find Jobs, Companies, and Reviews
          </Typography>
          <Spacer height={32} />
          <SearchBar
            width="50%"
            listItems={searchListItems}
            Component={DummyListItem}
            onSearchValChange={onSearchValChange}
          />
        </Hero>
      </HeroWrapper>
    </>
  )
}
