import styled from 'styled-components'
import { Color } from 'styles/color'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import WaveLogo from 'src/assets/logo/Footer'
import Link from '@mui/material/Link'
import MUITypography from '@mui/material/Typography'
import { Typography } from '../MUI/Typography'
import { Spacer } from '../Spacer/Spacer'

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
    font-size: 1rem;
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
        <MUITypography>
          <StyledLink
            href="/jobs"
            color={Color.textPrimary}
            variant="inherit"
            underline="none"
          >
            Jobs List
          </StyledLink>
        </MUITypography>
        <Spacer height={16} />
        <MUITypography>
          <StyledLink
            href="/companies"
            color={Color.textPrimary}
            underline="none"
          >
            Companies
          </StyledLink>
        </MUITypography>
        <Spacer height={16} />
        <MUITypography>
          <StyledLink href="/about" color={Color.textPrimary} underline="none">
            About
          </StyledLink>
        </MUITypography>
        <Spacer height={16} />
        <MUITypography>
          <StyledLink href="/login" color={Color.textPrimary} underline="none">
            Login
          </StyledLink>
        </MUITypography>
        <Spacer height={16} />
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
          <WaveLogo color="white" />
        </IconWrapper>
      </FooterWrapper>
      <BottomFooterWrapper>
        <StyledTypography color={Color.textPrimary} fontWeight="normal">
          © 2023 Wave. All rights reserved.
        </StyledTypography>
      </BottomFooterWrapper>
    </>
  )
}
