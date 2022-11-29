import React from 'react'
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Color } from '../styles/color';
import SearchBar from './SearchBar/SearchBar';
import { buildExtensionApiListener } from '../util/extension_api';
import { convertRawJobsForJobList } from 'util/extension_adapter';
import { DataGrid } from '@mui/x-data-grid';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Link } from '@mui/material';

const headerComponent = (headerData) =>
  <strong style={{fontSize: "1.1rem", color: Color.primary}}>
    {headerData.colDef.headerName}
  </strong>;

const columns = [
  { field: 'companyName', headerName: 'Company', flex: 0.3, renderHeader: headerComponent, 
    renderCell: (rowData) => 
    <div style={{ margin: '2px'}}>
      {rowData.row.companyName}<br/>
      <div style={{color:'grey', fontSize: '0.7rem'}}>
        {rowData.row.division}
      </div>
    </div>
  },
  { field: 'jobName', headerName: 'Job Name', flex: 0.3, renderHeader: headerComponent,
    renderCell: (rowData) => 
    <div style={{ margin: '2px'}}>
      <a href={`/jobs/${rowData.id}`}>{rowData.row.jobName}</a><br/>
      {rowData.row.level}
    </div>
  },

  { field: 'location', headerName: 'Location', flex: 0.1, renderHeader: headerComponent },
  { field: 'openings', headerName: 'Openings', flex: 0.1, align: 'center', headerAlign: 'center', renderHeader: headerComponent },
  { field: 'appDeadline', headerName: 'App Deadline', flex: 0.12, align: 'center', headerAlign: 'center', renderHeader: headerComponent },

  { field: 'shortlistAndApply', headerName: '', flex: 0.08, align: 'center',
    renderCell: (rowData) => 
      <>
        <BookmarkBorderIcon sx={{m:0.5, color: Color.primary }} />
        <Link href={`https://waterlooworks.uwaterloo.ca/myAccount/co-op/coop-postings.htm?ck_jobid=${rowData.id}`} target={"_blank"} sx={{m:0.5, color: Color.primary}}>
          <OpenInNewIcon/>
        </Link>
      </>
    
  },
];


export default function JobsPage() {
    useEffect(() => {
      document.title = 'Jobs';
    }, []);

    const [data, setData] = useState([]);

    useEffect(() => {
        const receiveExtensionMessage = buildExtensionApiListener({
          "get_all_jobs_raw": { 
            callback: (resp) => {
              setData(convertRawJobsForJobList(resp));
            }
          }
        });

        window.addEventListener("message", receiveExtensionMessage, false);
        // Specify how to clean up after this effect:
        return function cleanup() {
            window.removeEventListener("message", receiveExtensionMessage);
        };
    }, []);
  
    const [pageSize, setPageSize] = React.useState(10);

    return (
      <>
        <Box sx={{ m:2 }}>
          <SearchBar/>
        </Box>
        <Box sx={{ width: 'calc(100% - 32px)', m:2, mb:0 }}>
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[10, 25, 50]}
            pagination
            autoHeight
            rowHeight={100}
            disableSelectionOnClick
            sx={{
              ".MuiDataGrid-root, .MuiDataGrid-cell":{
                  whiteSpace: 'normal !important',
                  wordWrap: 'break-all !important'
                }, 
                ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                  m:1
                }
            }}
          />
        </Box>   
      </>  
    );
}
