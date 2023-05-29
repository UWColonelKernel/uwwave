import MUITypography from '@mui/material/Typography'
import styled from 'styled-components'

interface ITypography {
  color?: string
  fontWeight?: string
}
export const Typography = styled(MUITypography)<ITypography>`
  && {
    color: ${props => props.color ?? 'initial'};
    font-weight: ${props => props.fontWeight ?? 'initial'};
  }
`
