import MUILink from '@mui/material/Link'
import styled from 'styled-components'

interface ILink {
  color: string
}

export const Link = styled(MUILink)<ILink>`
  && {
    color: ${props => props.color ?? 'initial'};
  }
`
