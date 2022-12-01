import React from 'react'
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Color } from '../styles/color';
import { SearchBarJobsList } from 'components/SearchBar/variants/SearchBarJobsList';
import { buildExtensionApiListener } from '../util/extension_api';
import { convertRawJobsForJobList, convertRawJobsForJobListFilter, convertRawJobsForJobListSearch } from 'util/extension_adapter';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Link } from '@mui/material';
import lunr from 'lunr';
import { getSearchTypeField, SearchTypes } from 'util/search/search';
import Filter from 'components/SearchBar/Filter';

// @ts-ignore
import JOB_TAGS_FILE from '../ww_data_tags.json'; // TODO load this from somewhere else or generate it with a function
import { getFilterUniqueValuesByCategory, isJobMatched } from 'util/filter_job';

const headerComponent = (headerData) =>
  <strong style={{fontSize: "1rem", color: Color.primary}}>
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
  { field: 'appDeadline', headerName: 'App Deadline', flex: 0.12, align: 'center', headerAlign: 'center', renderHeader: headerComponent, sortComparator: (date1, date2) => Date.parse(date1) - Date.parse(date2) },

  { field: 'shortlistAndApply', headerName: 'Actions', flex: 0.08, align: 'center', headerAlign: 'center', renderHeader: headerComponent, sortable: false,
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

    const [data, setData] = useState({});
    const [searchData, setSearchData] = useState({});
    const [tableData, setTableData] = useState([]);
    const [searchChips, setSearchChips] = useState([]);
    const [isTableLoading, setIsTableLoading] = useState(true);

    const [searchIndex, setSearchIndex] = useState(lunr(() => {}));

    const [jobTagData, setJobTagData] = useState({});
    const [filterCategories, setFilterCategories] = useState({});
    const [filterFormula, setFilterFormula] = useState({});

    useEffect(() => {
      setSearchIndex(lunr(function () {
        this.ref('id')
        Object.values(SearchTypes).forEach((typeNum) => {
          this.field(getSearchTypeField(typeNum));
        }, this);

        Object.values(searchData).forEach((doc) => {
          this.add(doc);
        }, this);
      }));
    }, [searchData]);

    useEffect(() => {
      setFilterCategories(getFilterUniqueValuesByCategory(jobTagData));
    }, [jobTagData]);

    useEffect(() => {
        const receiveExtensionMessage = buildExtensionApiListener({
          "get_all_jobs_raw": { 
            callback: (resp) => {
              setData(convertRawJobsForJobList(resp));
              setSearchData(convertRawJobsForJobListSearch(resp));
              setJobTagData(convertRawJobsForJobListFilter(resp, JOB_TAGS_FILE));
              setIsTableLoading(false);
            }
          }
        });

        window.addEventListener("message", receiveExtensionMessage, false);
        // Specify how to clean up after this effect:
        return function cleanup() {
            window.removeEventListener("message", receiveExtensionMessage);
        };
    }, []);

    useEffect(() => {
      var queryString = "";
      searchChips.forEach(chip => {
        if (queryString !== "") {
          queryString += " ";
        }
        queryString += "+";
        const typeName = getSearchTypeField(chip.searchType);
        if (typeName !== "") {
          queryString += typeName + ":";
        }
        queryString += chip.searchVal;
      });

      var jobs = Object.values(data);
      if (queryString !== "") {
        const searchRankings = searchIndex.search(queryString);
        jobs = searchRankings.map((searchResult) => {
          return data[searchResult.ref];
        });
      }
      
      jobs = jobs.filter((job) => isJobMatched(job.id, filterFormula, jobTagData));

      setTableData(jobs);
    }, [data, searchIndex, searchChips, filterFormula, jobTagData]);

    // useEffect(() => {
    //   console.log(filterFormula);
    // }, [filterFormula]);
  
    const [pageSize, setPageSize] = React.useState(10);

    return (
      <>
        <Box sx={{ m:2 }}>
          <SearchBarJobsList onSearchUpdated={setSearchChips}/>
          {
            /*
            Need to pass in filters from calling filter_jobs
            */
          }
          <Filter  
            onFormulaChange={setFilterFormula} 
            filters={filterCategories}/>
        </Box>
        <Box sx={{ width: 'calc(100% - 32px)', m:2, mb:0 }}>
          <DataGrid
            rows={tableData}
            // @ts-ignore
            columns={columns}
            pageSize={pageSize}
            loading={isTableLoading}
            disableColumnMenu
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
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
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </Box>   
      </>  
    );
}
