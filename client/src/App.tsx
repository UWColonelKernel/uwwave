import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Footer } from 'components/Footer/Footer'
import { HomePage } from 'views/HomePage/HomePage'
import JobsListPage from 'views/JobsListPage'
import { createTheme, ThemeProvider } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { sendMessageOnLoadAndSetupListenerHook } from 'src/services/extension/extensionService'
import { ListenerId } from 'src/services/extension/listenerId'
import { RequestName } from 'src/shared/extension/dataBridge'
import {
  buildCoopJobsListFromExtensionData,
  buildFulltimeJobsListFromExtensionData,
} from 'src/util/jobsList'
import { JobBoard } from 'src/shared/extension/jobBoard'
import { Setup } from 'src/views/Setup'
import { SpecificJobPage } from './views/SpecificJobPage/SpecificJobPage'
import { AboutPage } from './views/AboutPage'
import { LocalStorageMetadataKeys } from './shared/extension/userProfile'

const theme = createTheme({
  typography: {
    fontFamily: ['Lato', 'san-serif'].join(','),
  },
})

export const App = () => {
  const [isDataReady, setIsDataReady] = useState(false)
  const [extensionData, setExtensionData] = useState<{ [key: string]: string }>(
    {},
  )
  const coopJobsListPageRows = useMemo(
    () => buildCoopJobsListFromExtensionData(extensionData),
    [extensionData],
  )
  const fulltimeJobsListPageRows = useMemo(
    () => buildFulltimeJobsListFromExtensionData(extensionData),
    [extensionData],
  )

  useEffect(() => {
    return sendMessageOnLoadAndSetupListenerHook(
      {
        id: ListenerId.allExtensionLocalStorage,
        reqName: RequestName.getLocal,
      },
      result => {
        console.info('Received callback to get extension data.')
        if (result) {
          setExtensionData(result)
          console.info('Successfully set extension data.')
        } else {
          console.warn(
            'Expected extension callback to return a result, but no result was returned',
          )
        }
      },
    )
  }, [])

  useEffect(() => {
    console.info(
      `Extension data updated: ${Object.values(extensionData).length}`,
    )
    setIsDataReady(true)
  }, [extensionData])

  return (
    <ThemeProvider theme={theme}>
      <div>
        <div style={{ minHeight: `calc(100vh - 185px)` }}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/jobs"
                element={
                  <JobsListPage
                    jobs={coopJobsListPageRows}
                    jobBoard={JobBoard.coop}
                    loading={!isDataReady}
                    dateScraped={
                      extensionData[LocalStorageMetadataKeys.SCRAPE_AT]
                    }
                  />
                }
              />
              <Route
                path="/jobs_fulltime"
                element={
                  <JobsListPage
                    jobs={fulltimeJobsListPageRows}
                    jobBoard={JobBoard.fulltime}
                    loading={!isDataReady}
                    dateScraped={
                      extensionData[LocalStorageMetadataKeys.SCRAPE_AT]
                    }
                  />
                }
              />
              <Route
                path="/jobs/:jobId"
                element={<SpecificJobPage jobs={extensionData} />}
              />
              {/* <Route path = '/login' element={<LoginPage />} />
              <Route path = '/jobs/:jobId' element={<Job/>} /> */}
              <Route path="/about-us" element={<AboutPage />} />
              <Route path="/setup" element={<Setup />} />
            </Routes>
          </BrowserRouter>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
