import 'bootstrap/dist/css/bootstrap.min.css'
import Footer from './components/Footer';
import NavigationBar from './components/NavigationBar';
import HomePage from './components/HomePage/HomePage';
import LoginPage from './components/LoginPage';
import JobsPage from './components/JobsPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <NavigationBar />
      <BrowserRouter>
        <Routes>
          <Route path = '/' element={<HomePage />} exact />
          <Route path = '/login' element={<LoginPage />} />
          <Route path = '/jobs' element={<JobsPage />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
