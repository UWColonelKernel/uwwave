import { useEffect, useMemo, useState } from 'react'
import defaultIcon from 'components/Icons/companyDefaultLogo.png'
import { Spacer } from 'src/components/Spacer/Spacer'
import { Button } from 'components/MUI/Button'
import { Color } from 'styles/color'
// import { SearchBar } from 'components/SearchBar/SearchBar'
import { CompanyCard } from 'components/CompanyCard/CompanyCard'
import { Divider } from 'components/MUI/Divider'
import { Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import styled from 'styled-components'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { buildCoopJobWithJobID } from 'src/util/jobsList'
import ReactHtmlParser from 'react-html-parser'
import { JobsPageRowData } from './JobsListPage'

type CompanyCard = {
  companyName: string
  positionTitle: string
}

type JobInfo = {
  title: string
  text: string
}

// jobInfo: { title: string; text: string }[]
// companyInfo: { imageURL: string; companyName: string; positionTitle: string }
// jobId: string
export const SpecificJobPage = (props: {
  jobs: Record<number, JobsPageRowData>
}) => {
  const { primary } = Color
  const { jobs } = props
  const [imageURL, setImageURL] = useState<string>('')
  const { jobId } = useParams()
  // const [job, setJob] = useState(jobs[jobId as unknown as number])
  const job = useMemo(
    () => buildCoopJobWithJobID(jobs, jobId as unknown as number),
    [jobs, jobId],
  )
  const [jobInfo, setJobInfo] = useState<JobInfo[]>([])

  const [companyInfo, setCompanyInfo] = useState<CompanyCard>({
    companyName: '',
    positionTitle: '',
  })

  useEffect(() => {
    setJobInfo([
      { title: 'Job Summary', text: job?.jobSummary ?? '' },
      {
        title: 'Job Responsibilities',
        text: job?.jobResponsibilities ?? '',
      },
      {
        title: 'Required Skills',
        text: job?.requiredSkills ?? '',
      },
      {
        title: 'Compensation and Benefits',
        text: job?.compensationAndBenefitsInformation ?? '',
      },
      {
        title: 'Company Name',
        text: job?.compensationAndBenefitsInformation ?? '',
      },
    ])
    setCompanyInfo({
      companyName: job?.companyName ?? '',
      positionTitle: job?.jobName ?? '',
      // jobOpenings: (job?.openings as unknown as string) ?? '',
    })
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

  const Search = () => (
    <>
      <Spacer />
      <Typography color={primary} variant="h5" fontWeight="bold">
        Explore Jobs
      </Typography>
      <Spacer />
      {/* <SearchBar width="50%" minWidth="300px" /> */}
      <Spacer />
    </>
  )

  const Header = () => (
    <>
      {imageURL !== '' && (
        <>
          <Grid item xs={12} md={8}>
            <CompanyCard
              imageURL={imageURL}
              companyName={companyInfo.companyName}
              positionTitle={companyInfo.positionTitle}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <WWButtons />
          </Grid>
        </>
      )}
    </>
  )

  const Description = () => (
    <>
      {jobInfo &&
        imageURL !== '' &&
        jobInfo.map((item: { title: string; text: string }) => {
          return item.text ? (
            <div key={item.title}>
              <Typography fontWeight="bold" variant="h5">
                {item.title}
              </Typography>
              <br />
              <div>{ReactHtmlParser(item.text)}</div>
              <br />
            </div>
          ) : (
            <></>
          )
        })}
    </>
  )
  const Body = () => (
    <>
      <Grid item xs={12} md={8}>
        <Description />
      </Grid>
      <Grid item xs={12} md={4} />
    </>
  )

  const WWButtons = () => {
    return (
      <>
        <ButtonsWrapper>
          <ButtonsInnerWrapper>
            <Button width={120} href="/">
              Shortlist
            </Button>
            <Button
              width={120}
              href={`https://waterlooworks.uwaterloo.ca/myAccount/co-op/coop-postings.htm?ck_jobid=${jobId}`}
              target="_blank"
            >
              Open on WW
            </Button>
          </ButtonsInnerWrapper>
        </ButtonsWrapper>
      </>
    )
  }

  return (
    <Container>
      <Search />
      <Divider color={primary} />
      <Spacer />
      <Grid container spacing={4}>
        <Header />
        <Body />
      </Grid>
    </Container>
  )
}

const ButtonsInnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 8px;
`

const ButtonsWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: end;
  justify-content: end;
  flex-direction: column;
  gap: 8px;
`
