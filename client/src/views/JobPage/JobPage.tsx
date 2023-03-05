import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import styled from 'styled-components'
import ReactHtmlParser from 'react-html-parser'
import { Typography } from 'components/MUI/Typography'
import { Button } from 'components/MUI/Button'
import { Color } from 'styles/color'
import { SearchBar } from 'components/SearchBar/SearchBar'
import { Spacer } from 'components/Spacer/Spacer'
import { CompanyCard } from 'components/CompanyCard/CompanyCard'
import { Divider } from 'components/MUI/Divider'
// seperate paragraphs with new line characters:
// interface TextBody{
//     title: tring
//     text: string
// }

// interface ICompanyCard{
//     imageURl: string
//     companyName: string
//     reviewCount?: number
//     ratingValue?: number
//     subtitle?: string
//     positionTitle?: string
// }

// interface IJobPage{ (props)
//     textBody: TextBody[]
//     companyCard: ICompanyCard
//     shortlistHref: string
//     applyHref: string
// }

export const JobPage = (props: {
  textBody: { title: string; text: string }[]
  companyCard: { imageURL: string; companyName: string; positionTitle: string }
  shortlistHref: string
  applyHref: string
}) => {
  const { primary } = Color

  const { textBody, companyCard, shortlistHref, applyHref } = props

  const { imageURL, companyName, positionTitle } = companyCard

  const Search = () => (
    <>
      <Spacer />
      <Typography color={primary} variant="h5" fontWeight="bold">
        Explore Jobs
      </Typography>
      <Spacer />
      <SearchBar width="50%" minWidth="300px" />
      <Spacer />
    </>
  )

  const Header = () => (
    <>
      <Grid item xs={12} md={8}>
        <CompanyCard
          imageURL={imageURL}
          companyName={ReactHtmlParser(companyName)}
          positionTitle={ReactHtmlParser(positionTitle)}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <WWButtons />
      </Grid>
    </>
  )

  const Description = () => (
    <>
      {textBody &&
        textBody.map((item: { title: string; text: string }) => (
          <div key={item.title}>
            <Typography fontWeight="bold" variant="h5">
              {item.title}
            </Typography>
            <br />
            <div>{ReactHtmlParser(item.text)}</div>
            <br />
          </div>
        ))}
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
            <Button width={120} href={shortlistHref}>
              Shortlist
            </Button>
            <Button width={120} href={applyHref} target="_blank">
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
