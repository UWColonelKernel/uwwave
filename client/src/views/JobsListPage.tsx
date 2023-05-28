import React, { useEffect } from 'react'

import Box from '@mui/material/Box'
// import { SearchBarJobsList } from 'components/SearchBar/variants/SearchBarJobsList'
// import {
//   convertRawJobsForJobList,
//   convertRawJobsForJobListFilter,
//   convertRawJobsForJobListSearch,
// } from 'util/extension_adapter'
import {
  DataGrid,
  GridColDef,
  GridColumnHeaderParams,
  GridToolbar,
} from '@mui/x-data-grid'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Link from '@mui/material/Link'
import Container from '@mui/material/Container'
// import lunr from 'lunr'
// import { getSearchTypeField, SearchTypes } from 'util/search/search'
// import Filter from 'components/SearchBar/Filter'
import Chip from '@mui/material/Chip'

// import { getFilterUniqueValuesByCategory, isJobMatched } from 'util/filter_job'
// import JOB_TAGS_FILE from '../ww_data_tags_industry.json' // TODO load this from somewhere else or generate it with a function
// import { buildExtensionApiListener } from '../util/extension_api'
import { JobBoard } from 'src/shared/extension/jobBoard'
import { NavigationBar } from 'src/components/NavigationBar/NavigationBar'
import { Color } from '../styles/color'

export interface JobsPageRowData {
  id: number
  jobName: string
  companyName: string
  division: string
  city: string
  country: string
  industryTag: string
  keywords: string[]
  openings: number
  appDeadline: string
  jobResponsibilities: string
  jobSummary: string
  requiredSkills: string
  compensationAndBenefitsInformation: string
}

export interface JobsPageProps {
  jobs: JobsPageRowData[]
  jobBoard: JobBoard
  loading: boolean
}

const headerComponent = (
  headerData: GridColumnHeaderParams<any, JobsPageRowData>,
) => (
  <strong style={{ fontSize: '1rem', color: Color.primary }}>
    {headerData.colDef.headerName}
  </strong>
)

const columns: GridColDef<JobsPageRowData>[] = [
  {
    field: 'companyName',
    headerName: 'Company',
    flex: 0.25,
    renderHeader: headerComponent,
    renderCell: rowData => (
      <div style={{ margin: '2px' }}>
        {rowData.row.companyName}
        <br />
        <div style={{ color: 'grey', fontSize: '0.7rem' }}>
          {rowData.row.division}
          <br />
        </div>
        <div style={{ color: 'blue', fontSize: '0.7rem' }}>
          {rowData.row.city}
          {rowData.row.city && rowData.row.country && ', '}
          {rowData.row.country}
        </div>
      </div>
    ),
  },
  {
    field: 'jobName',
    headerName: 'Job Name',
    flex: 0.25,
    renderHeader: headerComponent,
    renderCell: rowData => (
      <div style={{ margin: '2px' }}>
        <a href={`/jobs/${rowData.id}`}>{rowData.row.jobName}</a>
        <br />
        <Chip
          size="small"
          label={`Industry: ${rowData.row.industryTag}`}
          key={rowData.row.industryTag}
          sx={{
            margin: '2px',
          }}
        />
      </div>
    ),
  },
  {
    field: 'keywords',
    headerName: 'Keywords',
    flex: 0.24,
    renderHeader: headerComponent,
    renderCell: rowData => (
      <div style={{ margin: '2px' }}>
        {rowData.row.keywords &&
          rowData.row.keywords.map(keyword => {
            return (
              <Chip
                size="small"
                label={`${keyword}`}
                key={keyword}
                sx={{
                  margin: '2px',
                }}
              />
            )
          })}
      </div>
    ),
  },
  {
    field: 'openings',
    headerName: 'Openings',
    flex: 0.08,
    align: 'center',
    headerAlign: 'center',
    renderHeader: headerComponent,
  },
  {
    field: 'appDeadline',
    headerName: 'App Deadline',
    flex: 0.1,
    align: 'center',
    headerAlign: 'center',
    renderHeader: headerComponent,
    sortComparator: (date1: string, date2: string) =>
      Date.parse(date1) - Date.parse(date2),
  },

  {
    field: 'shortlistAndApply',
    headerName: 'Actions',
    flex: 0.08,
    align: 'center',
    headerAlign: 'center',
    renderHeader: headerComponent,
    sortable: false,
    renderCell: rowData => (
      <>
        <BookmarkBorderIcon sx={{ m: 0.5, color: Color.primary }} />
        <Link
          href={`https://waterlooworks.uwaterloo.ca/myAccount/co-op/coop-postings.htm?ck_jobid=${rowData.id}`}
          target="_blank"
          sx={{ m: 0.5, color: Color.primary }}
        >
          <OpenInNewIcon />
        </Link>
      </>
    ),
  },
]

export default function JobsListPage({ jobs, loading }: JobsPageProps) {
  useEffect(() => {
    document.title = 'Wave - Jobs List'
  }, [])

  const [pageSize, setPageSize] = React.useState(10)

  return (
    <>
      <NavigationBar />
      <Container>
        <Box sx={{ m: 2 }}>
          {/* <SearchBarJobsList onSearchUpdated={setSearchChips} /> */}
          {/*
            Need to pass in filters from calling filter_jobs
        */}
          {/* <Filter onFormulaChange={setFilterFormula} filters={filterCategories} /> */}
        </Box>
        <Box sx={{ width: 'calc(100% - 32px)', m: 2, mb: 0 }}>
          <DataGrid
            rows={jobs}
            columns={columns}
            pageSize={pageSize}
            loading={loading}
            disableColumnMenu
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            pagination
            autoHeight
            rowHeight={100}
            disableSelectionOnClick
            sx={{
              '.MuiDataGrid-root, .MuiDataGrid-cell': {
                whiteSpace: 'normal !important',
                wordWrap: 'break-all !important',
              },
              '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows':
                {
                  m: 1,
                },
            }}
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </Box>
      </Container>
    </>
  )
}
