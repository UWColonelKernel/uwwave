import styled from 'styled-components'
import Fab from '@mui/material/Fab'
import { Color } from 'src/styles/color'

export const PrimaryButton = styled(Fab).attrs({
  variant: 'extended',
})`
  && {
    color: white;
    background-color: ${Color.primaryButton}!important;
    font-weight: bold;
    margin: auto;
    min-width: 180px;
    padding-left: 24px;
    padding-right: 24px;
    box-shadow: 3px 4px ${Color.primaryButtonShadow};
  }
`
