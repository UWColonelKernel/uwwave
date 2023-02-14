import styled from 'styled-components'

interface ISpacer {
  width?: number
  height?: number
}
export const Spacer = styled.div<ISpacer>`
  width: ${props => (props.width ? `${props.width}px` : '100%')};
  height: ${props => (props.height ? `${props.height}px` : '16px')};
  display: block;
`
