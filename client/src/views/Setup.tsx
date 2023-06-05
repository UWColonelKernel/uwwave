import { NavigationBar } from 'src/components/NavigationBar/NavigationBar'
import styled from 'styled-components'
import Container from '@mui/material/Container'
import { Typography } from 'src/components/MUI/Typography'
import { Spacer } from 'src/components/Spacer/Spacer'
import { SetupStepper } from 'src/components/Stepper/SetupStepper'
import { useState } from 'react'
import Paper from '@mui/material/Paper'
import { PrimaryButton } from 'src/components/Buttons/PrimaryButton'
import { BackgroundColor } from 'src/styles/color'

const Step2 = () => {
  return (
    <MainPaper variant="outlined">
      <Typography align="center" variant="h6">
        <b>Download The Extension to get started</b>
      </Typography>
      <Spacer height={32} />
      <PrimaryButton>Download Extension</PrimaryButton>
      <Spacer height={32} />
      <Typography align="center">
        By leveraging our browser extension, Wave scrapes job postings directly
        from Waterloo Works.
        <br /> Then, you can browse company information, reviews, and other
        useful features!
      </Typography>
    </MainPaper>
  )
}

const Step3 = () => {
  return (
    <MainPaper variant="outlined">
      <Typography align="center" variant="h6">
        <b>Thanks for installing! You’re almost there:</b>
      </Typography>
      <Spacer height={32} />
      <Typography align="center">
        <b>Login to Waterloo Works</b> and our extension will automatically
        begin the scraping process. <br /> You’ll head back here once you’re
        done.
      </Typography>

      <Spacer height={32} />
      <PrimaryButton>Head to Waterloo Works</PrimaryButton>
    </MainPaper>
  )
}

const Step4 = () => {
  return (
    <MainPaper variant="outlined">
      <Typography align="center" variant="h6">
        <b>You’re all Set!</b>
      </Typography>
      <Spacer height={32} />
      <PrimaryButton>Start Browsing Jobs</PrimaryButton>
    </MainPaper>
  )
}

export const Setup = () => {
  const [step] = useState(1)
  const steps = [
    'Discover Wave',
    'Download The Extension',
    'Scrape Waterloo Works',
  ]
  return (
    <>
      <NavigationBar />
      <Container>
        <MainWrapper>
          <Spacer height={64} />
          <Typography variant="h6">
            <b>Setup: </b>
            {`${step} / 3`}
          </Typography>
          <Spacer height={32} />
          <SetupStepper activeStep={step} steps={steps} />
          <Spacer height={32} />
        </MainWrapper>
      </Container>
      <WaterWrapper>
        <Container>
          <MainWrapper>
            <Spacer height={64} />
            {step === 1 ? <Step2 /> : null}
            {step === 2 ? <Step3 /> : null}
            {step === 3 ? <Step4 /> : null}
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
  background: ${BackgroundColor.darker};
  min-height: 100vh;
`

const MainPaper = styled(Paper)`
  && {
    padding: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 300px;
    background-color: ${BackgroundColor.dark};
  }

  && .MuiTypography-root {
    color: white;
  }
`
