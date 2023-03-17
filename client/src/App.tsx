import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Spacer } from 'components/Spacer/Spacer'
import { Footer } from 'components/Footer/Footer'
import { NavigationBar } from 'components/NavigationBar/NavigationBar'
import { HomePage } from 'views/HomePage/HomePage'
import { createTheme, ThemeProvider } from '@mui/material'
import { useEffect, useState } from 'react'
import { sendMessageOnLoadAndSetupListenerHook } from 'src/services/extension/extensionService'
import { ListenerId } from 'src/services/extension/listenerId'
import { RequestName } from 'src/shared/extension/dataBridge'

const theme = createTheme({
  typography: {
    fontFamily: ['Lato', 'san-serif'].join(','),
  },
})

export const App = () => {
  const [extensionData, setExtensionData] = useState({})

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
  }, [extensionData])

  return (
    <ThemeProvider theme={theme}>
      <div>
        <NavigationBar />
        <div style={{ minHeight: `calc(100vh - 185px)` }}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              {/* <Route path = '/login' element={<LoginPage />} />
              <Route path = '/jobs' element={<JobsPage />} />
              <Route path = '/jobs/:jobId' element={<Job/>} />
              <Route path = '/about-us' element={<AboutPage/>}/> */}
            </Routes>
          </BrowserRouter>
        </div>
        <Spacer height={50} />
        <Footer />
      </div>
    </ThemeProvider>
  )
}
