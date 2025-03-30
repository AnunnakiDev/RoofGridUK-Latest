import React, { useState, useEffect } from 'react';
import { Box, Container, Tabs, Tab, Typography } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from 'components/Navbar'; // Use absolute import
import Footer from 'components/Footer'; // Use absolute import
import { useUser } from 'context/UserContext'; // Use absolute import

const AdminLayout: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [tabValue, setTabValue] = useState(0);

  // Define navigation items
  const navItems = [
    { label: 'Dashboard', path: '/admin/profile' },
    { label: 'Saved Projects', path: '/admin/projects' },
    ...(user?.subscription === 'pro' ? [{ label: 'Personal Tiles', path: '/admin/personal-tiles' }] : []),
    { label: 'Tile Management', path: '/admin/tile-management' },
    { label: 'User Management', path: '/admin/user-management' },
  ];

  // Update the active tab based on the current route
  useEffect(() => {
    const currentPath = location.pathname;
    const activeTabIndex = navItems.findIndex((item) => item.path === currentPath);
    setTabValue(activeTabIndex !== -1 ? activeTabIndex : 0);
  }, [location.pathname, navItems]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    navigate(navItems[newValue].path);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      {/* Tabs Navigation */}
      <Box
        sx={{
          bgcolor: '#1b75bc',
          px: { xs: 1, sm: 2 }, // Responsive padding for tabs container
          pt: 1,
          pb: 0,
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTab-root': {
              color: 'white',
              fontWeight: 'medium',
              textTransform: 'none',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              px: { xs: 2, sm: 3 },
              py: 1,
            },
            '& .MuiTab-root.Mui-selected': {
              color: 'white',
              bgcolor: '#1565c0', // Slightly darker shade for selected tab
              borderRadius: '8px 8px 0 0',
            },
            '& .MuiTabs-indicator': {
              display: 'none', // Remove the default underline
            },
          }}
        >
          {navItems.map((item) => (
            <Tab key={item.label} label={item.label} />
          ))}
        </Tabs>
      </Box>
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 2, sm: 3 }, // Padding top for content
          pb: { xs: '80px', md: '100px' }, // Space for footer
          width: '100%',
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
          <Outlet />
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default AdminLayout;