import { AppBar } from '@mui/material'
import Toolbar from '@mui/material/Toolbar'
import MUITypography from '@mui/material/Typography'
import styled from 'styled-components'
import { Color } from 'styles/color'
import WaveLogo from 'src/assets/logo/Navbar'
import Link from '@mui/material/Link'
import Container from '@mui/material/Container'
import React from 'react'
import { Spacer } from '../Spacer/Spacer'

interface INavigationBar {
  textColor?: string
  backgroundColor?: string
}

type PageItem = {
  pageName: string
  pageUrl: string
}

const StyledLink = styled(Link)`
  && {
    &:active {
      text-decoration: underline;
    }
  }
`

const LogoWrapper = styled.div`
  display: flex;
  align-items: left;
  flex-grow: 1;
`

const pages: PageItem[] = [
  {
    pageName: 'Jobs List',
    pageUrl: '/jobs',
  },
  {
    pageName: 'Companies',
    pageUrl: '/companies',
  },
  {
    pageName: 'About Us',
    pageUrl: '/about-us',
  },
]

export const NavigationBar = (props: INavigationBar) => {
  const { textColor, backgroundColor = 'transparent' } = props
  const path = window.location.pathname
  const color = textColor ?? Color.textSecondary
  return (
    <>
      <AppBar position="static" elevation={0} sx={{ bgcolor: backgroundColor }}>
        <Container>
          <Toolbar>
            <LogoWrapper>
              <Link href="/">
                <WaveLogo color={color} />
              </Link>
            </LogoWrapper>
            {pages.map((pageItem: PageItem, i) => (
              <React.Fragment key={pageItem.pageUrl}>
                <MUITypography>
                  <StyledLink
                    variant="subtitle1"
                    href={pageItem.pageUrl}
                    color={color}
                    underline={path === pageItem.pageUrl ? 'always' : 'hover'}
                  >
                    {pageItem.pageName}
                  </StyledLink>
                </MUITypography>
                {i < pages.length - 1 ? <Spacer width={24} /> : null}
              </React.Fragment>
            ))}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  )
}
