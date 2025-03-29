import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { WeatherProvider } from './context/WeatherContext'; // Added import
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import Login from './pages/Login';
import Register from './pages/Register';
import SavedProjects from './pages/SavedProjects';
import Profile from './pages/Profile';
import CustomTiles from './pages/CustomTiles';
import AdminProfile from './pages/AdminProfile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Disclaimer from './pages/Disclaimer';
import TermsOfService from './pages/TermsOfService';

const App: React.FC = () => {
  return (
    <UserProvider>
      <WeatherProvider> {/* Added WeatherProvider */}
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/saved-projects" element={<SavedProjects />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/custom-tiles" element={<CustomTiles />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
          </Routes>
        </Router>
      </WeatherProvider>
    </UserProvider>
  );
};

export default App;