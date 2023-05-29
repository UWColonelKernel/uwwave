import Fab from '@mui/material/Fab'
import styled from 'styled-components'

export const PrimaryButton = styled(Fab).attrs({
  variant: 'extended',
  size: 'medium',
})`
  && {
    color: white;
    background: linear-gradient(
      135.34deg,
      #00c2ff 15.92%,
      #0082d5 49.59%,
      #0145ac 82.57%
    );
    font-weight: bold;
    margin: auto;
    min-width: 180px;
  }
`
