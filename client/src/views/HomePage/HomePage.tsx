import React from 'react'
import Container from '@mui/material/Container'
import styled from 'styled-components'
import { NavigationBar } from 'src/components/NavigationBar/NavigationBar'
import Typography from '@mui/material/Typography'
import { Spacer } from 'src/components/Spacer/Spacer'
import { UwaterlooLogo } from 'src/assets/UwaterlooLogo'
import Fab from '@mui/material/Fab'
import Paper from '@mui/material/Paper'
import { SearchBar } from 'src/components/SearchBar/SearchBar'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import BuildIcon from '@mui/icons-material/Build'
import BusinessIcon from '@mui/icons-material/Business'
import FactoryIcon from '@mui/icons-material/Factory'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import StarIcon from '@mui/icons-material/Star'
import SearchIcon from '@mui/icons-material/Search'
import { BackgroundColor, Color } from 'src/styles/color'
import { PrimaryButton } from 'src/components/Buttons/PrimaryButton'

export const HomePage = () => {
  const renderDummySearchBar = () => (
    <DummySearchPaper>
      <SearchBar
        listItems={[]}
        Component={() => <></>}
        onSearchValChange={() => null}
        value="My Dream Job..."
      />
      <Spacer height={8} />
      <Stack direction="row" spacing={1}>
        <Chip icon={<BuildIcon />} label="Python" />
        <Chip icon={<BusinessIcon />} label="Microsoft" />
        <Chip icon={<FactoryIcon />} label="AI" />
      </Stack>
      <Spacer height={16} />
      <FiltersWrapper>
        <div>
          <Typography>
            <b>Documents</b>
          </Typography>
          <FormControlLabel
            control={<ExcludeCheckbox />}
            label="Cover Letter"
          />
        </div>
        <Divider orientation="vertical" flexItem />
        <div>
          <Typography>
            <b>Duration</b>
          </Typography>
          <div>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="4 months"
            />
          </div>
          <div>
            <FormControlLabel control={<Checkbox />} label="8 months" />
          </div>
        </div>
        <Divider orientation="vertical" flexItem />
        <div>
          <Typography>
            <b>Location</b>
          </Typography>
          <div>
            <FormControlLabel control={<Checkbox />} label="Canada" />
          </div>
          <div>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="USA"
            />
          </div>
          <div>
            <FormControlLabel control={<Checkbox />} label="Asia" />
          </div>
        </div>
      </FiltersWrapper>
      <RelativeWrapper>
        <CompanyCard>
          <CompanyLogo />
          <div>
            <Typography>
              <b>Data Science Co-op</b>
            </Typography>
            <Typography>Microsoft</Typography>
          </div>
          <LocationWrapper>
            <Typography>Seattle</Typography>
            <img
              src="https://cdn-icons-png.flaticon.com/512/555/555526.png"
              width="32px"
              alt=""
            />
          </LocationWrapper>
          <StatsWrapper>
            <Pillar>
              <InnerPillar1>
                <RatingIcon />
              </InnerPillar1>
            </Pillar>
            <Pillar>
              <InnerPillar2>
                <MoneyIcon />
              </InnerPillar2>
            </Pillar>
            <Pillar>
              <InnerPillar3>
                <ScoreIcon />
              </InnerPillar3>
            </Pillar>
          </StatsWrapper>
        </CompanyCard>
      </RelativeWrapper>
    </DummySearchPaper>
  )
  return (
    <>
      <HeroWrapper>
        <NavigationBar textColor="white" />
        <Container>
          <Spacer height={64} />
          <Title>
            The Ultimate <br /> Waterloo Works Companion
          </Title>
          <Spacer height={16} />
          <SubTitleWrapper>
            <UwaterlooLogo />
            <Spacer width={8} />
            <SubTitle>
              {' '}
              Browse Jobs, Salaries and Reviews with Upgraded Search
            </SubTitle>
          </SubTitleWrapper>
          <Spacer height={64} />
          <Center>
            <PrimaryButton href="/setup">Get Started</PrimaryButton>
          </Center>
          <Spacer height={64} />
          <Center>{renderDummySearchBar()}</Center>
        </Container>

        <Hero />
      </HeroWrapper>
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
    min-height: 100vh;
  }
`
const HeroWrapper = styled.div`
  width: 100%;
  background: ${BackgroundColor.dark};
  min-height: 100vh;
`

const Title = styled(Typography).attrs({
  variant: 'h2',
})`
  && {
    color: white;
    text-align: center;
    font-weight: bold;
    text-shadow: 1px 4px rgba(7, 20, 30, 0.42);
  }
`

const SubTitle = styled(Typography).attrs({
  variant: 'h5',
})`
  && {
    color: white;
    text-align: center;
  }
`

const SubTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Center = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`

const DummySearchPaper = styled(Paper).attrs({
  variant: 'outlined',
})`
  && {
    padding: 16px;
    max-width: 500px;
    width: 100%;
    pointer-events: none;
    user-select: none;
    box-shadow: 2px 2px 8px rgba(7, 20, 30, 0.42);
  }
`

const ExcludeCheckbox = styled(Checkbox).attrs({
  defaultChecked: true,
  indeterminate: true,
})`
  && svg {
    fill: red;
  }
`

const FiltersWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
`
const RelativeWrapper = styled.div`
  position: relative;
  width: 100%;
`

const CompanyCard = styled(Paper).attrs({
  variant: 'outlined',
})`
  padding: 8px;
  position: absolute;
  top: -40px;
  left: -32px;
  display: flex;
  gap: 24px;
  align-items: center;
  box-shadow: 2px 2px 8px rgba(7, 20, 30, 0.42);
`
const CompanyLogo = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 4px;
  background-image: url(https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
`

const LocationWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const StatsWrapper = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`

const Pillar = styled.div`
  height: 64px;
  width: 16px;
  border-radius: 16px;
  background-color: #cfd2d9;
  display: flex;
  flex-direction: column-reverse;
`

const InnerPillar1 = styled.div`
  height: 45px;
  width: 16px;
  border-radius: 16px;
  background-color: ${Color.rating};
  flex-direction: column-reverse;
  display: flex;
  align-items: center;
`

const InnerPillar2 = styled.div`
  height: 54px;
  width: 16px;
  border-radius: 16px;
  background-color: ${Color.salary};
  flex-direction: column-reverse;
  display: flex;
  align-items: center;
`

const InnerPillar3 = styled.div`
  height: 30px;
  width: 16px;
  border-radius: 16px;
  background-color: ${Color.compatibility};
  flex-direction: column-reverse;
  display: flex;
  align-items: center;
`

const MoneyIcon = styled(AttachMoneyIcon)`
  && {
    fill: white;
    width: 16px;
  }
`

const RatingIcon = styled(StarIcon)`
  && {
    fill: white;
    width: 16px;
  }
`

const ScoreIcon = styled(SearchIcon)`
  && {
    fill: white;
    width: 16px;
  }
`
