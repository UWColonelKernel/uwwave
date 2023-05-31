import Paper from '@mui/material/Paper'
import styled from 'styled-components'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { Typography } from '../MUI/Typography'
import { Spacer } from '../Spacer/Spacer'

interface CompanyCardProps {
  imageURL: string
  companyName: string
  city?: string
  country?: string
  positionTitle?: string
  reviewCount?: number
  ratingValue?: number
  subtitle?: string
  isOutlined?: boolean
}
interface MainWrapperProps {
  isOutlined?: boolean
}

export const CompanyCard = ({
  imageURL,
  companyName,
  city,
  country,
  positionTitle,
  reviewCount,
  ratingValue,
  subtitle,
  isOutlined,
}: CompanyCardProps) => {
  return (
    <MainWrapper variant={isOutlined ? 'outlined' : 'elevation'} elevation={0}>
      <ImageWrapper src={imageURL} />
      <Spacer width={8} />
      <NameWrapper>
        {city && country ? (
          <Typography
            fontWeight={!positionTitle ? 'bold' : 'initial'}
            color="gray"
            fontSize="14px"
          >
            <LocationOnIcon
              fontSize="small"
              style={{ verticalAlign: 'middle', marginBottom: '5px' }}
            />
            {`${city} ${country}`}
          </Typography>
        ) : null}
        <Typography fontWeight={!positionTitle ? 'bold' : 'initial'}>
          {companyName}
        </Typography>
        {positionTitle ? (
          <Typography fontWeight="bold" fontSize="20px">
            {positionTitle}
          </Typography>
        ) : null}
      </NameWrapper>
    </MainWrapper>
  )
}

const MainWrapper = styled(Paper)<MainWrapperProps>`
  & {
    display: flex;
    padding: ${props => (props.isOutlined ? `16px` : '0px')};
    position: relative;
  }
`

const ImageWrapper = styled.img`
  width: 80px;
  height: 80px;
  border: 1px solid gray;
  border-radius: 10px;
`

const NameWrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  flex: 1;
`
