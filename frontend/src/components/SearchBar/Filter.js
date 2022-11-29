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


const [checkStates, setCheckStates] = useState({});

export function getFormula(){
  let formula = {bool_op: 'AND', operands: []};

  for (const [category, tags] of Object.entries(checkStates)){
    let subFormula = {bool_op: 'AND', operands: []};
    let orFormula = {bool_op: 'OR', operands: []};
    let orNotFormula = {bool_op: 'OR', operands: []};

    tags.forEach((tag) => {
      if (checkStates[category][tag] != null){
        let term = {category: {category}, value: {tag}};
        if (!!checkStates[category][tag]){
          orFormula.operands.push(term);
        }
        else {
          orNotFormula.operands.push(term);
        }
      }
    })

    let notFormula = {bool_op: 'NOT', operands: [orNotFormula]};
    subFormula.operands.push(orFormula);
    subFormula.operands.push(notFormula);

    formula.operands.push(subFormula);
  }

  return formula;
}

export default function Filter(props) {

  const {
    width,
    filters
  } = props;

  useEffect(() => {
    let initialState = {};
    for (const [category, tags] of Object.entries(filters)){
      initialState[category] = {};

      tags.forEach((tag) => {
        initialState[category][tag] = null;
      })
    }
    setCheckStates(initialState);
  }, []);


  const handleChange = (event) => {
    let newStates = checkStates;
    let oldState = checkStates[event.target.value[0]][event.target.value[1]];

    let nextState;
    if (oldState === false) {
      nextState = null;
    } else if (oldState === true) {
      nextState = false;
    } else {
      nextState = true;
    }

    newStates[event.target.value[0]][event.target.value[1]] = nextState;

    setCheckStates(newStates);
  };

  return (
    <MainWrapper width={width}>
      <Accordion>
        <AccordionSummary sx={{backgroundColor: Color.primary}}
          expandIcon={<ExpandMoreIcon />}>
          <Typography color="common.white">Advanced Search Filters</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Grid container spacing={2}>
          {
            Object.entries(filters).map(([category, tags]) => (
              <Grid item md={4} xs={6}>
                <Item>
                  <Typography variant='h4'>{category}</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                    {
                      tags.map((tag) => { 
                        return ( 
                          <FormControlLabel
                            label={tag}
                            control={
                              <Checkbox
                                value = {[category,tag]}
                                checked={!!checkStates[category][tag]}
                                indeterminate={checkStates[category][tag] == null}
                                onChange={handleChange}
                                color={checkStates[category][tag] == null ? "secondary" : "primary"}
                              />
                            }
                          />
                        );
                      })}
                    </Box>
                </Item>
              </Grid>
            ))
          }
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
  width: ${props=>props.width ?? "initial"};
`