import { NavigationBar } from 'src/components/NavigationBar/NavigationBar'
import styled from 'styled-components'
import Container from '@mui/material/Container'
import { Typography } from 'src/components/MUI/Typography'
import { Spacer } from 'src/components/Spacer/Spacer'
import Paper from '@mui/material/Paper'
import { PrimaryButton } from 'src/components/Buttons/PrimaryButton'

export const AboutPage = () => {
  return (
    <>
      <NavigationBar />
      <Container>
        <MainWrapper>
          <Spacer height={64} />
          <Typography>
            uwWave is a Capstone Project lead by a team of SE24s
          </Typography>
          <Spacer height={64} />
          <Typography variant="h5">
            <b>Meet The Team</b>
          </Typography>
          <Spacer height={64} />
        </MainWrapper>
      </Container>
      <WaterWrapper>
        <Container>
          <MainWrapper>
            <Spacer height={32} />
            <PicturesRow>
              <ProfileWrapper>
                <RelativeWrapper>
                  <ProfileImageBackground color="#0145AC" />
                  <ProfileImageWrapper imageURL="bryan.png" />
                </RelativeWrapper>
                <Spacer height={4} />
                <Name>
                  <b>Bryan</b>
                </Name>
                <Spacer height={4} />
                <Name>Design & Full Stack</Name>
              </ProfileWrapper>
              <ProfileWrapper>
                <RelativeWrapper>
                  <ProfileImageBackground color="#00C2FF" />
                  <ProfileImageWrapper imageURL="michelle.png" />
                </RelativeWrapper>
                <Spacer height={4} />
                <Name>
                  <b>Michelle</b>
                </Name>
                <Spacer height={4} />
                <Name>Machine Learning</Name>
              </ProfileWrapper>
              <ProfileWrapper>
                <RelativeWrapper>
                  <ProfileImageBackground color="#0145AC" />
                  <ProfileImageWrapper imageURL="william.png" />
                </RelativeWrapper>
                <Spacer height={4} />
                <Name>
                  <b>William</b>
                </Name>
                <Spacer height={4} />
                <Name>Extension</Name>
              </ProfileWrapper>
            </PicturesRow>
            <Spacer height={32} />
            <PicturesRow>
              <ProfileWrapper>
                <RelativeWrapper>
                  <ProfileImageBackground color="#00C2FF" />
                  <ProfileImageWrapper imageURL="linda.png" />
                </RelativeWrapper>
                <Spacer height={4} />
                <Name>
                  <b>Linda</b>
                </Name>
                <Spacer height={4} />
                <Name>Frontend</Name>
              </ProfileWrapper>

              <ProfileWrapper>
                <RelativeWrapper>
                  <ProfileImageBackground color="#00C2FF" />
                  <ProfileImageWrapper imageURL="andrew.png" />
                </RelativeWrapper>
                <Spacer height={4} />
                <Name>
                  <b>Andrew</b>
                </Name>
                <Spacer height={4} />
                <Name>Frontend</Name>
              </ProfileWrapper>
            </PicturesRow>
            <Spacer height={32} />
            <ContactPaper>
              <Typography variant="h5" align="center">
                <b>Contact</b>
              </Typography>
              <Spacer height={16} />
              <Typography align="center">
                Have feedback, questions, or concerns about Wave? Don’t hesitate
                to reach out!
              </Typography>
              <Spacer height={32} />
              <PrimaryButton href="mailto:uwaterloowave@gmail.com">
                Email
              </PrimaryButton>
            </ContactPaper>
            <Spacer height={32} />
            <Name variant="h6">
              <b>Contributors</b>
            </Name>
            <Spacer height={32} />
            <PicturesRow>
              <ProfileWrapper>
                <RelativeWrapper>
                  <ProfileImageBackground color="#0145AC" />
                  <ProfileImageWrapper imageURL="yiwei.png" />
                </RelativeWrapper>
                <Spacer height={4} />
                <Name>
                  <b>Yi Wei</b>
                </Name>
                <Spacer height={4} />
                <Name>Backend</Name>
              </ProfileWrapper>
            </PicturesRow>
          </MainWrapper>
        </Container>
      </WaterWrapper>
    </>
  )
}

const MainWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

const WaterWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  background: linear-gradient(
    153.7deg,
    #058dda 32.98%,
    #004aa0 53.06%,
    #032544 81.36%
  );
  min-height: 100vh;
`

const RelativeWrapper = styled.div`
  position: relative;
  width: 160px;
  height: 160px;
`

interface IProfileImageWrapper {
  imageURL: string
}
const ProfileImageWrapper = styled.div<IProfileImageWrapper>`
  width: 144px;
  height: 144px;
  border-radius: 100%;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-image: url(${props => props.imageURL});
  position: absolute;
  top: 0;
  left: 0;
`

interface IProfileImageBackground {
  color: string
}
const ProfileImageBackground = styled.div<IProfileImageBackground>`
  width: 152px;
  height: 152px;
  border-radius: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: ${props => props.color};
`

const PicturesRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
`

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Name = styled(Typography)`
  && {
    color: white;
  }
`

const ContactPaper = styled(Paper).attrs({
  variant: 'outlined',
})`
  && {
    padding: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`
