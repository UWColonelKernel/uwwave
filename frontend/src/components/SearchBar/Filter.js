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

function getFormula(checkStates){
  let formula = {bool_op: 'AND', operands: []};

  for (const [category, tags] of Object.entries(checkStates)){
    let subFormula = {bool_op: 'AND', operands: []};
    let orFormula = {bool_op: 'OR', operands: []};
    let orNotFormula = {bool_op: 'OR', operands: []};

    for (const [tag, value] of Object.entries(tags)){
      if (value !== false){ // false is blank checkbox
        let term = {category: category, value: tag};
        if (!!value){
          orFormula.operands.push(term);
        }
        else {
          orNotFormula.operands.push(term);
        }
      }
    }

    if (orFormula.operands.length > 0) {
      subFormula.operands.push(orFormula);
    }
    if (orNotFormula.operands.length > 0) {
      let notFormula = {bool_op: 'NOT', operands: [orNotFormula]};
      subFormula.operands.push(notFormula);
    }

    if (subFormula.operands.length > 0) {
      formula.operands.push(subFormula);
    }
  }

  return formula;
}

// interface ISearchPar{
//   filters: { string: string[] },  // category: [tags]
//   onFormulaChange: (formula: {}) => {}  // formula is a boolean algebra formula tree
// }
export default function Filter(props) {
  const {
    filters,
    onFormulaChange,
  } = props;

  const getInitialState = () => {
    let initialState = {};
    for (const [category, tags] of Object.entries(filters)){
      initialState[category] = {};

      tags.forEach((tag) => {
        initialState[category][tag] = false;
      })
    }
    return initialState;
  };

  const [checkStates, setCheckStates] = useState(getInitialState());

  useEffect(() => {
    onFormulaChange(getFormula(checkStates));
  }, [checkStates, onFormulaChange]);

  const handleChange = (event) => {
    const category = event.target.value.split(',')[0];
    const tagValue = event.target.value.split(',')[1];
    let newStates = {...checkStates}; // copy object to trigger a rerender
    let oldState = checkStates[category][tagValue];

    let nextState;
    if (oldState === false) {
      nextState = true;
    } else if (oldState === true) {
      nextState = null;
    } else {
      nextState = false;
    }

    newStates[category][tagValue] = nextState;

    setCheckStates(newStates);
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}>
        <Typography>Advanced Filters</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {
            checkStates && Object.entries(filters).map(([category, tags]) => (
              <Grid key={category} item md={4} xs={6}>
                <Item>
                  <Typography sx={{ paddingLeft: "16px", paddingTop: "8px" }} variant='subtitle1'>{category}</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                    {
                      tags.map((tag) => { 
                        return ( 
                          <FormControlLabel
                            key={tag}
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
  )
}

const Item = styled(Paper)`
textAlign: 'center';
justifyContent:'center';
alignItems:'center';
`