import { useEffect, useMemo, useState } from 'react'
import defaultIcon from 'components/Icons/companyDefaultLogo.png'
import { Spacer } from 'src/components/Spacer/Spacer'
import { Button } from 'components/MUI/Button'
import { Color } from 'styles/color'
// import { SearchBar } from 'components/SearchBar/SearchBar'
import { CompanyCard } from 'components/CompanyCard/CompanyCard'
import { Box, Container, Tab, Tabs, Typography } from '@mui/material'
import MUIButton from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import styled from 'styled-components'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { buildCoopJobWithJobID } from 'src/util/jobsList'
import ReactHtmlParser from 'react-html-parser'
import { NavigationBar } from 'src/components/NavigationBar/NavigationBar'
import { JobsPageRowData } from 'src/views/JobsListPage'
import SpecificJobPageSection from 'src/views/SpecificJobPage/SpecificJobPageSection'
import 'src/styles/globalStyles.css'

type CompanyCard = {
  companyName: string
  city: string
  country: string
  positionTitle: string
}

type ExtraInfo = {
  title: string
  text: string
}

type JobInfo = {
  title: string
  text: string
}

// jobInfo: { title: string; text: string }[]
// companyInfo: { imageURL: string; companyName: string; city: string; country:string; positionTitle: string }
// jobId: string
export const SpecificJobPage = (props: {
  jobs: Record<number, JobsPageRowData>
}) => {
  const { jobs } = props
  const [imageURL, setImageURL] = useState<string>('')
  const { jobId } = useParams()

  const job = useMemo(
    () => buildCoopJobWithJobID(jobs, jobId as unknown as number),
    [jobs, jobId],
  )
  const [jobInfo, setJobInfo] = useState<JobInfo[]>([])

  const [companyInfo, setCompanyInfo] = useState<CompanyCard>({
    companyName: '',
    city: '',
    country: '',
    positionTitle: '',
  })

  const [extraInfo, setExtraInfo] = useState<ExtraInfo[]>([])
  const [tabSelected, setTabSelected] = useState(0)
  const handleTabChange = (event: any, newTab: number) => {
    setTabSelected(newTab)
  }

  useEffect(() => {
    setJobInfo([
      {
        title: 'Job Summary',
        text:
          job?.jobSummary.replace(
            /<\s*(?:table|tr)[^>]*>|<\/\s*(?:table|tr)\s*>/g,
            '',
          ) ?? '',
      },
      {
        title: 'Job Responsibilities',
        text:
          job?.jobResponsibilities.replace(
            /<\s*(?:table|tr)[^>]*>|<\/\s*(?:table|tr)\s*>/g,
            '',
          ) ?? '',
      },
      {
        title: 'Required Skills',
        text:
          job?.requiredSkills.replace(
            /<\s*(?:table|tr)[^>]*>|<\/\s*(?:table|tr)\s*>/g,
            '',
          ) ?? '',
      },
    ])

    setCompanyInfo({
      companyName: job?.companyName ?? '',
      city: job?.city ?? '',
      country: job?.country ?? '',
      positionTitle: job?.jobName ?? '',
    })

    setExtraInfo([
      {
        title: 'Deadline',
        text: job?.appDeadline ?? '',
      },
      {
        title: 'Compensation/Benefits',
        text: job?.compensationAndBenefitsInformation ?? '',
      },
    ])
  }, [job])

  useEffect(() => {
    axios
      .get(
        `https://842gb0w279.execute-api.ca-central-1.amazonaws.com/items/${companyInfo.companyName}`,
      )
      .then((res: any) => {
        if (res.data.Item) {
          setImageURL(res.data.Item.logo)

          const dashIndex = res.data.Item.salary.indexOf('-')
          let salary = `$${res.data.Item.salary}`
          if (dashIndex >= 0)
            salary = `${salary.slice(0, dashIndex + 2)}$${salary.slice(
              dashIndex + 2,
            )}`
          if (res.data.Item.Currency) salary += ` ${res.data.Item.Currency}`

          setJobInfo([
            ...jobInfo,
            {
              title: 'Salary',
              text: salary,
            },
            {
              title: 'Company Website',
              text: `<a href=//${res.data.Item.domain} target='_blank'>${res.data.Item.domain}</a>`,
            },
          ])
        } else {
          setImageURL(defaultIcon)
        }
      })
      .catch((err: any) => err)
  }, [companyInfo, jobInfo])

  useEffect(() => {
    document.title = `Wave - ${job?.jobName}`
  }, [job])

  // const Search = () => (
  //   <>
  //     <Spacer />
  //     <Typography color={primary} variant="h5" fontWeight="bold">
  //       Explore Jobs
  //     </Typography>
  //     <Spacer />
  //     {/* <SearchBar width="50%" minWidth="300px" /> */}
  //     <Spacer />
  //   </>
  // )

  const CompanyHeader = () => (
    <>
      {imageURL !== '' && (
        <>
          <Grid item xs={12} md={8}>
            <CompanyCard
              imageURL={imageURL}
              companyName={companyInfo.companyName}
              city={companyInfo.city}
              country={companyInfo.country}
              positionTitle={companyInfo.positionTitle}
            />
          </Grid>
        </>
      )}
    </>
  )

  const Description = () => (
    <Box style={{ marginLeft: '110px', maxWidth: '60%', padding: '16px' }}>
      {jobInfo &&
        jobInfo.map((item: { title: string; text: string }) => {
          return (
            item.text && (
              <SpecificJobPageSection
                jobSectionTitle={item.title}
                jobSectionDescription={ReactHtmlParser(item.text)}
              />
            )
          )
        })}
    </Box>
  )
  const StyledTab = styled(Tab)({
    '&.MuiTab-textColorPrimary': {
      color: 'white',
    },
  })
  const StyledShortlistButton = styled(MUIButton)({
    '&.MuiButton-textPrimary': {
      color: '#0082D5',
      width: '100%',
      cursor: 'pointer',
      border: '1px solid #058DDA',
    },
  })
  const JobBody = () => (
    <div>
      {imageURL !== '' && (
        <Tabs
          TabIndicatorProps={{ style: { backgroundColor: 'white' } }}
          value={tabSelected}
          onChange={handleTabChange}
          sx={{ marginLeft: '150px', paddingTop: '16px' }}
        >
          <StyledTab label="Details" />
          {/* <StyledTab label="Reviews" /> */}
        </Tabs>
      )}
      {imageURL !== '' && (
        <Box sx={{ display: tabSelected === 0 ? 'flex' : 'none' }}>
          <Description />
          <Box
            bgcolor="white"
            sx={{
              alignSelf: 'flex-start',
              minWidth: '15vw',
              maxWidth: '20%',
              borderRadius: '16px',
              p: 2,
              m: 4,
            }}
          >
            <Button
              sx={{ borderRadius: '50px', marginBottom: '10px' }}
              className="BlueGradientBackground"
              width="100%"
              href={`https://waterlooworks.uwaterloo.ca/myAccount/co-op/coop-postings.htm?ck_jobid=${jobId}`}
              target="_blank"
            >
              Apply
            </Button>
            <StyledShortlistButton
              sx={{ borderRadius: '50px', marginBottom: '10px' }}
              href={`https://waterlooworks.uwaterloo.ca/myAccount/co-op/coop-postings.htm?ck_jobid=${jobId}`}
              target="_blank"
            >
              Shortlist
            </StyledShortlistButton>
            {extraInfo &&
              extraInfo.map((item: { title: string; text: string }) => {
                return (
                  item.text && (
                    <>
                      <Typography variant="h6" fontWeight="bold">
                        {item.title}
                      </Typography>
                      <Typography>{ReactHtmlParser(item.text)}</Typography>
                    </>
                  )
                )
              })}
            <Typography variant="h6" fontWeight="bold" />
          </Box>
        </Box>
      )}
      {/* <Box sx={{ display: tabSelected === 1 ? 'flex' : 'none' }}>bonjour</Box> */}
    </div>
  )

  return (
    <>
      <NavigationBar />
      <Container style={{ paddingLeft: '170px' }}>
        <MainWrapper>
          <Spacer height={48} />
          <CompanyHeader />
          <Spacer height={32} />
        </MainWrapper>
      </Container>
      <WaterWrapper>
        <Container>
          <MainWrapper>
            <JobBody />
          </MainWrapper>
        </Container>
      </WaterWrapper>
    </>
  )
}

const MainWrapper = styled.div`
  display: flex;
  align-items: left;
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
