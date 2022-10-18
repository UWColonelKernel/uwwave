import 'bootstrap/dist/css/bootstrap.min.css'
import Footer from './components/Footer';
import NavigationBar from './components/NavigationBar';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <NavigationBar />
      <BrowserRouter>
        <Routes>
          <Route path = '/' element={<HomePage />} exact />
          <Route path = '/login' element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
