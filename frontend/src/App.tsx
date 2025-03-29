import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import Login from './pages/Login';
import Register from './pages/Register';
import SavedProjects from './pages/SavedProjects';
import Profile from './pages/Profile'; // Added import
import CustomTiles from './pages/CustomTiles'; // Added import

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/saved-projects" element={<SavedProjects />} />
          <Route path="/profile" element={<Profile />} /> {/* Added route */}
          <Route path="/custom-tiles" element={<CustomTiles />} /> {/* Added route */}
          {/* Add more routes as we implement pages */}
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;