import 'bootstrap/dist/css/bootstrap.min.css'
import Footer from './components/Footer';
import NavigationBar from './components/NavigationBar';
import HomePage from './components/HomePage/HomePage';
import LoginPage from './components/LoginPage';
import JobsPage from './components/JobsPage';
import { Job } from './views/Page';
import AboutPage from './components/AboutPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Spacer } from "./components/Spacer/Spacer";

function App() {
  return (
    <div>
      <NavigationBar />
      <div style={{minHeight: `calc(100vh - 185px)`}}>
        <BrowserRouter>
          <Routes>
            <Route path = '/' element={<HomePage />} exact />
            <Route path = '/login' element={<LoginPage />} />
            <Route path = '/jobs' element={<JobsPage />} />
            <Route path = '/jobs/:jobId' element={<Job/>} />
            <Route path = '/about-us' element={<AboutPage/>}/>
          </Routes>
        </BrowserRouter>
      </div>
      <Spacer height={50}/>
      <Footer />
    </div>
  );
}

export default App;
