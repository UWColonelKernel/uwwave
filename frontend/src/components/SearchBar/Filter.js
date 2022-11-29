import React from 'react'
import { useState, useEffect } from 'react';
import styled from "styled-components"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Color } from 'styles/color';

// interface ISearchPar{
//   width: string, //css string
//   minWidth: string //css string
//   listItems: any[],
//   Component: React.FC<any> //should take listItem's type as props
//   onSearchValChange : (val: string)=>{} // val is the value of the search field
// }

export default function Filter() {

  const [checked, setChecked] = useState([false,false]);

  const handleChange1 = (event) => {
    setChecked([event.target.checked, checked[1]]);
  };

  const handleChange2 = (event) => {
    setChecked([checked[0], event.target.checked]);
  };

  return (
    <MainWrapper>
      <Accordion>
        <AccordionSummary sx={{backgroundColor: Color.primary}}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>Advanced Search Filters</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Grid container spacing={2}>
            <Grid item xs={4}>
              <Item>
                <Typography variant='subtitle1'>Documents</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                  <FormControlLabel
                    label="Transcript"
                    control={<Checkbox checked={checked[0]} onChange={handleChange1} />}
                  />
                  <FormControlLabel
                    label="No Cover Letter"
                    control={<Checkbox checked={checked[1]} onChange={handleChange2} />}
                  />
                </Box>
              </Item>
            </Grid>
            <Grid item xs={4}>
              <Item>something</Item>
            </Grid>
            <Grid item xs={4}>
              <Item>something</Item>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </MainWrapper>
  )
}

const Item = styled(Paper)`
  textAlign: 'center';
  justifyContent:'center';
  alignItems:'center';
`

const MainWrapper = styled.div`
  position: relative;
  width: 100%;
`