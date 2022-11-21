import React from 'react'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {Box, Button} from '@mui/material';
import { Color } from "../styles/color";
import SearchBar from './SearchBar';

const columns = [
    { id: 'companyName', label: 'Company', width: '20%' },
    { id: 'jobName', label: 'Job Name', width: '60%' },
    {
      id: 'shortlistAndApply',
      label: '',
      width: '20%',
    },
  ];

  const rows = [
    {
        id: 1,
        companyName: "Apple",
        jobName: "Software Engineer Intern"
    },
    {
        id: 2,
        companyName: "Apple",
        jobName: "Machine Learning Engineer Intern"
    },
    {
        id: 3,
        companyName: "Apple",
        jobName: "Data Scientist Intern"
    },
    {
        id: 4,
        companyName: "Apple",
        jobName: "Watch System Tool Engineer Intern"
    },
    {
        id: 5,
        companyName: "Amazon",
        jobName: "Software Engineering Intern"
    },
    {
        id: 6,
        companyName: "Datadog",
        jobName: "Product Design Intern"
    },
    {
        id: 7,
        companyName: "Datadog",
        jobName: "Software Engineering Intern"
    },
    {
        id: 8,
        companyName: "Microsoft",
        jobName: "Software Engineering Intern"
    }
  ];

export default function JobsPage() {
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
                    style={{ width: column.width, color: Color.primary,fontWeight: "bold", fontSize: "1.1rem" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                      {columns.map((column, index) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                              {column.id === 'shortlistAndApply' &&
                                <Box>
                                    <Button variant="contained" sx={{m:0.5}}>Shortlist</Button>
                                    <Button variant="contained" sx={{m:0.5}}>Apply</Button>
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
          count={rows.length}
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
