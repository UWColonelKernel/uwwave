import MUIButton from '@mui/material/Button'
import React from 'react'
import styled from 'styled-components'
import { Color } from '../../styles/color'

export const Button = styled(otherProps => <MUIButton {...otherProps} />).attrs(
  props => ({ type: props.type ?? '' }),
)`
  &&& {
    background-color: ${props => props.backgroundcolor ?? Color.primary};
    color: white;
    display: flex;
    height: ${props => (props.height ? `${props.height}px` : 'initial')};
    padding: ${props => (props.padding ? `${props.padding}px` : '')};
    cursor: pointer;
    width: ${props =>
      props.maxwidth ? '100%' : props.width ? `${props.width}px` : 'initial'};
  }
  &: hover {
    background-color: ${props => props.backgroundcolor ?? Color.primary};
  }
`
