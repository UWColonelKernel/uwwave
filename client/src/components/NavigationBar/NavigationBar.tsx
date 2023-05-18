import { AppBar } from '@mui/material'
import Toolbar from '@mui/material/Toolbar'
import MUITypography from '@mui/material/Typography'
import styled from 'styled-components'
import { Color } from 'styles/color'
import WaveLogo from 'assets/logo/Navbar.svg'
import Link from '@mui/material/Link'

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
    padding-left: 20px;
    padding-right: 20px;
    &:active {
      text-decoration: underline;
    }
  }
`

const LogoWrapper = styled.div`
  display: flex;
  padding-left: 130px;
  align-items: center;
  flex-grow: 1;
`

const SpaceBlock = styled.div`
  width: 150px;
`

const pages: PageItem[] = [
  {
    pageName: 'Jobs List',
    pageUrl: '/jobs',
  },
  {
    pageName: 'Companies List',
    pageUrl: '/companies',
  },
  {
    pageName: 'About Us',
    pageUrl: '/about-us',
  },
]

export const NavigationBar = (props: INavigationBar) => {
  const { textColor = Color.textSecondary, backgroundColor = 'transparent' } =
    props
  const path = window.location.pathname

  return (
    <>
      <AppBar position="static" elevation={0} sx={{ bgcolor: backgroundColor }}>
        <Toolbar>
          <LogoWrapper>
            <Link href="/">
              <WaveLogo fill={textColor} />
            </Link>
          </LogoWrapper>
          {pages.map((pageItem: PageItem) => (
            <MUITypography>
              <StyledLink
                variant="h5"
                href={pageItem.pageUrl}
                color={textColor}
                fontWeight="bold"
                underline={path === pageItem.pageUrl ? 'always' : 'hover'}
              >
                {pageItem.pageName}
              </StyledLink>
            </MUITypography>
          ))}
          <SpaceBlock />
          {path === '/' && <h2>I hope this works</h2>}
        </Toolbar>
      </AppBar>
    </>
  )
}
