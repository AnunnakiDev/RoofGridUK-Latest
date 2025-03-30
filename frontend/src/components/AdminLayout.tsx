import React, { useState, useEffect } from 'react';
import { Box, Container, Tabs, Tab } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from 'components/Navbar'; // Use absolute import
import Footer from 'components/Footer'; // Use absolute import
import { useUser } from 'context/UserContext'; // Use absolute import
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const AdminLayout: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [tabValue, setTabValue] = useState(0);

  // Use theme and media query to determine navbar height
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // xs to sm
  const navbarHeight = isMobile ? 56 : 64; // Default MUI AppBar heights

  // Define navigation items
  const navItems = [
    { label: 'Admin Dashboard', path: '/admin/profile' },
    { label: 'Projects', path: '/admin/projects' },
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
      {/* Sticky Tabs Navigation */}
      <Box
        sx={{
          bgcolor: '#f5f5f5', // Subtle background (light gray)
          px: { xs: 0.5, sm: 2 }, // Reduced padding on mobile
          py: { xs: 0.5, sm: 1 }, // Reduced padding on mobile
          borderBottom: '1px solid #e0e0e0',
          position: 'sticky', // Make the tabs sticky
          top: { xs: 56, sm: 56, md: 64 }, // Align directly under Navbar (responsive heights)
          zIndex: 1100, // Ensure it stays above other content
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)', // Subtle shadow for depth
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
              color: '#1b75bc', // Use primary color for text
              fontWeight: 'medium',
              textTransform: 'none',
              fontSize: { xs: '0.85rem', sm: '1rem' }, // Smaller font on mobile
              px: { xs: 1.5, sm: 3 }, // Reduced padding on mobile
              py: { xs: 0.5, sm: 1 }, // Reduced padding on mobile
              minHeight: { xs: 36, sm: 48 }, // Smaller height on mobile
              opacity: 0.7, // Subtle opacity for unselected tabs
            },
            '& .MuiTab-root.Mui-selected': {
              color: '#1b75bc',
              bgcolor: '#ffffff', // White background for selected tab
              borderRadius: '8px',
              opacity: 1, // Full opacity for selected tab
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Subtle shadow for selected tab
            },
            '& .MuiTabs-indicator': {
              display: 'none', // Remove the default underline
            },
            '& .MuiTabs-scrollButtons': {
              color: '#1b75bc', // Scroll buttons match the primary color
              width: { xs: 24, sm: 40 }, // Smaller scroll buttons on mobile
              opacity: 0.7,
              '&.Mui-disabled': {
                opacity: 0.3,
              },
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