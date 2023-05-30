import { Box } from '@mui/material'
import { Typography } from 'src/components/MUI/Typography'

const SpecificJobPageSection = (props: {
  jobSectionTitle: string
  jobSectionDescription: string
}) => {
  const { jobSectionTitle, jobSectionDescription } = props

  return (
    <Box bgcolor="white" sx={{ borderRadius: '16px', p: 2, m: 2 }}>
      <Typography variant="h6" fontWeight="bold">
        {jobSectionTitle}
      </Typography>
      <Typography> {jobSectionDescription}</Typography>
    </Box>
  )
}

export default SpecificJobPageSection
