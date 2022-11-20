import styled from "styled-components";

export const Spacer = styled.div`
  width: ${props => (props.width ? `${props.width}px` : "100%")};
  height: ${props => (props.height ? `${props.height}px` : "16px")};
  display: block;
`;