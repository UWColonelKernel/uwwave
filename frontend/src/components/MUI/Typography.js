import MUITypography from '@mui/material/Typography';
import styled from "styled-components";

export const Typography = styled( MUITypography)`
&& {
  color: ${props=>props.color ?? "initial"};
  font-weight: ${props=>props.fontWeight ?? "initial"};
}
`
