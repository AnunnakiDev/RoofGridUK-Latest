import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { WeatherProvider } from './context/WeatherContext';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import Login from './pages/Login';
import Register from './pages/Register';
import SavedProjects from './pages/SavedProjects'; // This might be redundant with /admin/projects
import Profile from './pages/Profile';
import CustomTiles from './pages/CustomTiles';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSavedProjects from './pages/admin/SavedProjects'; // Renamed to avoid conflict
import PersonalTiles from './pages/admin/PersonalTiles';
import TileManagement from './pages/admin/TileManagement';
import UserManagement from './pages/admin/UserManagement';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Disclaimer from './pages/Disclaimer';
import TermsOfService from './pages/TermsOfService';
import AppBenefits from './pages/AppBenefits';
import HowToUse from './pages/HowToUse';
import ProTips from './pages/ProTips';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact'; // New import

const App: React.FC = () => {
  return (
    <UserProvider>
      <WeatherProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/saved-projects" element={<SavedProjects />} /> {/* Existing route */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/custom-tiles" element={<CustomTiles />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/app-benefits" element={<AppBenefits />} />
            <Route path="/how-to-use" element={<HowToUse />} />
            <Route path="/pro-tips" element={<ProTips />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} /> {/* New route */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="profile" element={<AdminDashboard />} />
              <Route path="projects" element={<AdminSavedProjects />} />
              <Route path="personal-tiles" element={<PersonalTiles />} />
              <Route path="tile-management" element={<TileManagement />} />
              <Route path="user-management" element={<UserManagement />} />
            </Route>
          </Routes>
        </Router>
      </WeatherProvider>
    </UserProvider>
  );
};

export default App;