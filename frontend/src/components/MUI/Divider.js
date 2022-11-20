import styled from "styled-components";
import MUIDivider from '@mui/material/Divider';

export const Divider = styled(MUIDivider).attrs({variant: "middle"})`
    & {
        opacity: 0.5;
        border-color: ${props=>props.color ?? "initial"};
    }
`