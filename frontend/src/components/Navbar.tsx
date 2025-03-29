import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useUser } from '../context/UserContext';
import WeatherWidget from './WeatherWidget';

const Navbar: React.FC = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Calculator', path: '/calculator' },
    { label: 'How to Use', path: '/how-to-use' },
    { label: 'App Benefits', path: '/app-benefits' },
    { label: 'Pro Tips', path: '/pro-tips' },
    { label: 'Resources', path: '/resources' },
  ];

  // Add Admin Dashboard link for admin users
  const adminItems = user.role === 'admin'
    ? [{ label: 'Admin Dashboard', path: '/admin/profile' }]
    : [];

  const userItems = user.id
    ? [
        { label: 'Profile', path: '/profile' },
        { label: 'Logout', action: handleLogout },
      ]
    : [
        { label: 'Login', path: '/login' },
        { label: 'Sign Up', path: '/register' },
      ];

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: '#1b75bc',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          RoofGrid UK
        </Typography>
        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          {navItems.map((item) => (
            <Button
              key={item.label}
              color="inherit"
              onClick={() => navigate(item.path)}
              sx={{ mx: 1, fontSize: '1rem', textTransform: 'none' }}
            >
              {item.label}
            </Button>
          ))}
          {adminItems.map((item) => (
            <Button
              key={item.label}
              color="inherit"
              onClick={() => navigate(item.path)}
              sx={{ mx: 1, fontSize: '1rem', textTransform: 'none' }}
            >
              {item.label}
            </Button>
          ))}
          {userItems.map((item) => (
            <Button
              key={item.label}
              color="inherit"
              onClick={item.action ? item.action : () => navigate(item.path!)}
              sx={{ mx: 1, fontSize: '1rem', textTransform: 'none' }}
            >
              {item.label}
            </Button>
          ))}
          <WeatherWidget />
        </Box>
        {/* Mobile Navigation */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
          <WeatherWidget />
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                width: '200px',
              },
            }}
          >
            {navItems.map((item) => (
              <MenuItem key={item.label} onClick={() => { navigate(item.path); handleClose(); }}>
                {item.label}
              </MenuItem>
            ))}
            {adminItems.map((item) => (
              <MenuItem key={item.label} onClick={() => { navigate(item.path); handleClose(); }}>
                {item.label}
              </MenuItem>
            ))}
            {userItems.map((item) => (
              <MenuItem key={item.label} onClick={() => { item.action ? item.action() : navigate(item.path!); handleClose(); }}>
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;