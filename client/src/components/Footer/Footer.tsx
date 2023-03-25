import styled from 'styled-components'
import { Color } from 'styles/color'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import Wave from 'assets/logo/Footer.svg'
import Link from '@mui/material/Link'
import { Typography } from '../MUI/Typography'

const FooterWrapper = styled.div`
  background-color: #061e39;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`

const BottomFooterWrapper = styled.div`
  background-color: #021021;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 15px;
  padding-top: 10px;
`

const StyledLink = styled(Link)`
  && {
    font-size: 1.5rem;
    padding: 5px;
  }
`

const StyledTypography = styled(Typography)`
  && {
    font-size: 1rem;
  }
`

const SocialMediaWrapper = styled.div`
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const IconWrapper = styled.div`
  padding: 10px;
`

export const Footer = () => {
  return (
    <>
      <FooterWrapper>
        {/* Weird font bug, need to wrap link with typography: https://mui.com/material-ui/api/link */}
        <Typography>
          <StyledLink
            href="/jobs"
            color={Color.textPrimary}
            variant="inherit"
            underline="none"
          >
            Jobs List
          </StyledLink>
        </Typography>
        <Typography>
          <StyledLink
            href="/companies"
            color={Color.textPrimary}
            underline="none"
          >
            Companies
          </StyledLink>
        </Typography>
        <Typography>
          <StyledLink href="/about" color={Color.textPrimary} underline="none">
            About
          </StyledLink>
        </Typography>
        <Typography>
          <StyledLink href="/login" color={Color.textPrimary} underline="none">
            Login
          </StyledLink>
        </Typography>
        <SocialMediaWrapper>
          <IconWrapper>
            <FacebookIcon style={{ color: Color.textPrimary, fontSize: 40 }} />
          </IconWrapper>
          <IconWrapper>
            <InstagramIcon style={{ color: Color.textPrimary, fontSize: 40 }} />
          </IconWrapper>
          <IconWrapper>
            <TwitterIcon style={{ color: Color.textPrimary, fontSize: 40 }} />
          </IconWrapper>
        </SocialMediaWrapper>
        <IconWrapper>
          <img src={Wave} alt="Wave" />
        </IconWrapper>
      </FooterWrapper>
      <BottomFooterWrapper>
        <StyledTypography color={Color.textPrimary}>
          Lorem Ipsum Sample Text Fill Up Space
        </StyledTypography>
      </BottomFooterWrapper>
    </>
  )
}
