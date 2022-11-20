import React from 'react'
import Paper from '@mui/material/Paper';
import styled from "styled-components"
import { Typography } from '../../MUI/Typography';
import { Spacer } from "../../Spacer/Spacer";
import { Color } from "../../../styles/color";

export const Tile = ({
    title,
    children
}) => {
  return (
    <PaperWrapper >
        <Typography color={Color.primary} variant="subtitle1" fontWeight="bold">{title}</Typography>
        <Spacer />
        <Content>
        {children}
        </Content>
    </PaperWrapper >
  )
}

const PaperWrapper = styled(Paper).attrs({elevation: 0})`
    & {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 300px;
        padding: 16px;
    }
`

const Content = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`



