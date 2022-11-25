import React from 'react'
import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Color } from '../styles/color';
import SearchBar from './SearchBar';
import { buildExtensionApiListener } from '../util/extension_api';
import { convertRawJobsForJobList, convertRawJobForJobPage } from 'util/extension_adapter';

const columns = [
    { id: 'companyName', label: 'Company', width: '20%' },
    { id: 'jobName', label: 'Job Name', width: '60%' },
    {
      id: 'shortlistAndApply',
      label: '',
      width: '20%',
    },
  ];


export default function JobsPage() {
    const [data, setData] = useState([{}]);

    useEffect(() => {
        const receiveExtensionMessage = buildExtensionApiListener({
          "get_all_jobs_raw": { 
            callback: (resp) => {
              setData(convertRawJobsForJobList(resp));
            }
          },
          "get_job_raw": { 
            callback: (resp) => {
              console.log(convertRawJobForJobPage(resp));
            },
            req: {
              jobid: "291618"
            }
          }
        });

        window.addEventListener("message", receiveExtensionMessage, false);
        // Specify how to clean up after this effect:
        return function cleanup() {
            window.removeEventListener("message", receiveExtensionMessage);
        };
    }, []);
  
    const {
        primary
    } = Color;
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
  
    return (
      <Paper sx={{ overflow: 'hidden', m: 1 }}>
        <SearchBar/>
        <TableContainer sx={{ m: 1 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    color={primary}
                    style={{ width: column.width, fontWeight: "bold", fontSize: "1.1rem" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column, index) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                              {column.id === 'shortlistAndApply' &&
                                <Box>
                                    <Button variant="contained" sx={{m:0.5, backgroundColor: Color.primary}}>Shortlist</Button>
                                    <Button variant="contained" href={`https://waterlooworks.uwaterloo.ca/myAccount/co-op/coop-postings.htm?ck_jobid=${row.id}`} target={"_blank"} sx={{m:0.5, backgroundColor: Color.primary}}>Open on WW</Button>
                                </Box>
                              }
                          </TableCell>

                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                m:1
              }
          }}
        />
      </Paper>
    );
}
