import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { WeatherProvider } from './context/WeatherContext';
import { useUser } from './context/UserContext';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminLayout from './components/AdminLayout';
import ProfileLayout from './components/ProfileLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import TileManagement from './pages/admin/TileManagement';
import UserManagement from './pages/admin/UserManagement';
import SavedProjects from './pages/SavedProjects';
import CustomTiles from './pages/CustomTiles';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Disclaimer from './pages/Disclaimer';
import TermsOfService from './pages/TermsOfService';
import AppBenefits from './pages/AppBenefits';
import HowToUse from './pages/HowToUse';
import ProTips from './pages/ProTips';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Resources from './pages/Resources';

// Protected Route Component for Pro Users
const ProtectedProRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  if (!user?.id) {
    return <Navigate to="/login" replace />;
  }
  if (user.subscription !== 'pro') {
    return <Navigate to="/profile" replace />;
  }
  return <>{children}</>;
};

// Protected Route Component for Admins
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  if (!user?.id) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <WeatherProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/app-benefits" element={<AppBenefits />} />
            <Route path="/how-to-use" element={<HowToUse />} />
            <Route path="/pro-tips" element={<ProTips />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/resources" element={<Resources />} />

            {/* Pro User Routes */}
            <Route path="/profile" element={<ProtectedProRoute><ProfileLayout /></ProtectedProRoute>}>
              <Route index element={<Navigate to="/profile/saved-projects" replace />} />
              <Route path="saved-projects" element={<SavedProjects />} />
              <Route path="custom-tiles" element={<CustomTiles />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
              <Route path="profile" element={<AdminDashboard />} />
              <Route path="projects" element={<SavedProjects />} />
              <Route path="personal-tiles" element={<CustomTiles />} />
              <Route path="tile-management" element={<TileManagement />} />
              <Route path="user-management" element={<UserManagement />} />
            </Route>

            {/* Redirect if not authenticated */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </WeatherProvider>
    </UserProvider>
  );
};

export default App;