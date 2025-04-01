import React, { useState, useEffect } from 'react';
import { Box, Container, Tabs, Tab, Breadcrumbs, Link, Typography } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from 'components/Navbar';
import Footer from 'components/Footer';
import { useUser } from 'context/UserContext';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const ProfileLayout: React.FC = () => {
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
    { label: 'Saved Projects', path: '/profile/saved-projects' },
    { label: 'Saved Tiles', path: '/profile/custom-tiles' },
    { label: 'Profile', path: '/profile/profile' },
  ];

  // Update the active tab based on the current route
  useEffect(() => {
    const currentPath = location.pathname;
    const activeTabIndex = navItems.findIndex((item) => item.path === currentPath);
    if (activeTabIndex !== -1) {
      setTabValue(activeTabIndex);
    }
  }, [location.pathname, navItems]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    navigate(navItems[newValue].path);
  };

  // Generate breadcrumbs based on the current path
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    const breadcrumbItems = [];

    // Always start with "Profile"
    breadcrumbItems.push(
      <Link
        key="profile"
        underline="hover"
        color="inherit"
        onClick={() => navigate('/profile/saved-projects')}
        sx={{ cursor: 'pointer' }}
      >
        Profile
      </Link>
    );

    // Map paths to labels
    const pathMap: { [key: string]: string } = {
      'saved-projects': 'Saved Projects',
      'custom-tiles': 'Saved Tiles',
      'profile': 'Profile',
    };

    pathnames.forEach((value, index) => {
      if (value === 'profile') return; // Skip "profile" as it's already added
      const path = `/${pathnames.slice(0, index + 1).join('/')}`;
      const label = pathMap[value] || value;
      const isLast = index === pathnames.length - 1;

      breadcrumbItems.push(
        isLast ? (
          <Typography key={path} color="text.primary">
            {label}
          </Typography>
        ) : (
          <Link
            key={path}
            underline="hover"
            color="inherit"
            onClick={() => navigate(path)}
            sx={{ cursor: 'pointer' }}
          >
            {label}
          </Link>
        )
      );
    });

    return breadcrumbItems;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      {/* Sticky Tabs Navigation */}
      <Box
        sx={{
          bgcolor: '#f5f5f5',
          px: { xs: 0.5, sm: 2 },
          py: { xs: 0.5, sm: 1 },
          borderBottom: '1px solid #e0e0e0',
          position: 'sticky',
          top: { xs: 56, sm: 56, md: 64 },
          zIndex: 1100,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
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
              color: '#1b75bc',
              fontWeight: 'medium',
              textTransform: 'none',
              fontSize: { xs: '0.85rem', sm: '1rem' },
              px: { xs: 1.5, sm: 3 },
              py: { xs: 0.5, sm: 1 },
              minHeight: { xs: 36, sm: 48 },
              opacity: 0.7,
            },
            '& .MuiTab-root.Mui-selected': {
              color: '#1b75bc',
              bgcolor: '#ffffff',
              borderRadius: '8px',
              opacity: 1,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            },
            '& .MuiTabs-indicator': {
              display: 'none',
            },
            '& .MuiTabs-scrollButtons': {
              color: '#1b75bc',
              width: { xs: 24, sm: 40 },
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
      {/* Breadcrumbs */}
      <Box
        sx={{
          bgcolor: '#fafafa',
          px: { xs: 2, sm: 3 },
          py: 1,
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          {generateBreadcrumbs()}
        </Breadcrumbs>
      </Box>
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 2, sm: 3 },
          pb: { xs: '80px', md: '100px' },
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

export default ProfileLayout;