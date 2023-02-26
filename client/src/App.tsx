import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Spacer } from 'components/Spacer/Spacer'
import { Footer } from 'components/Footer/Footer'
import { NavigationBar } from 'components/NavigationBar/NavigationBar'
import { HomePage } from 'views/HomePage/HomePage'

import GlobalFonts from 'fonts/fonts'

export const App = () => {
  return (
    <div>
      <GlobalFonts />
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
  )
}
