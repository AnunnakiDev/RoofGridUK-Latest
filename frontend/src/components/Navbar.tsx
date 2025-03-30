import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Box, IconButton, Menu, MenuItem, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useUser } from '../context/UserContext';
import WeatherWidget from './WeatherWidget';

interface NavItem {
  label: string;
  path?: string;
  action?: () => void;
}

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

  // Static pages always in burger menu
  const staticItems: NavItem[] = [
    { label: 'Home', path: '/' },
    { label: 'How to Use', path: '/how-to-use' },
    { label: 'App Benefits', path: '/app-benefits' },
    { label: 'Pro Tips', path: '/pro-tips' },
    { label: 'Resources', path: '/resources' },
    { label: 'FAQ', path: '/faq' },
  ];

  // Dynamic items based on user state
  const dynamicItems: NavItem[] = !user.id
    ? [
        { label: 'Calculator', path: '/calculator' },
        { label: 'Login', path: '/login' },
        { label: 'Sign Up', path: '/register' },
      ]
    : user.subscription === 'free'
    ? [
        { label: 'Calculator', path: '/calculator' },
        { label: 'Upgrade to Pro', path: '/profile' },
      ]
    : [
        { label: 'Calculator', path: '/calculator' },
        { label: 'Profile', path: '/profile' },
        { label: 'Projects', path: '/saved-projects' },
        { label: 'Saved Tiles', path: '/custom-tiles' },
      ];

  // Admin item if applicable
  const adminItems: NavItem[] = user.role === 'admin' ? [{ label: 'Admin Dashboard', path: '/admin/profile' }] : [];

  // All items for mobile menu
  const mobileMenuItems: NavItem[] = [
    ...dynamicItems,
    ...adminItems,
    ...staticItems,
    ...(user.id ? [{ label: 'Logout', action: handleLogout }] : []),
  ];

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: '#ffffff',
        color: 'black',
        borderTop: '4px solid #1b75bc', // Thicker blue line
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <Toolbar>
        <Box
          component="div"
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <img
            src="/RoofGrid320x63.png"
            alt="RoofGrid UK"
            style={{ maxHeight: '50px', width: 'auto', marginRight: '8px' }}
          />
        </Box>
        {/* Desktop Navigation */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', '800': 'flex' }, justifyContent: 'flex-end', alignItems: 'center' }}>
          {dynamicItems.map((item) => (
            <Button
              key={item.label}
              color="inherit"
              onClick={() => navigate(item.path!)}
              sx={{ mx: 1, fontSize: '1rem', textTransform: 'none' }}
            >
              {item.label}
            </Button>
          ))}
          {adminItems.map((item) => (
            <Button
              key={item.label}
              color="inherit"
              onClick={() => navigate(item.path!)}
              sx={{ mx: 1, fontSize: '1rem', textTransform: 'none' }}
            >
              {item.label}
            </Button>
          ))}
          <WeatherWidget sx={{ display: { xs: 'none', sm: 'block' } }} /> {/* Hide below 600px */}
          <IconButton
            size="large"
            color="inherit"
            onClick={handleMenu}
            sx={{ ml: 1 }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{ style: { width: '200px' } }}
          >
            {staticItems.map((item) => (
              <MenuItem key={item.label} onClick={() => { navigate(item.path!); handleClose(); }}>
                {item.label}
              </MenuItem>
            ))}
            {user.id && (
              <MenuItem onClick={() => { handleLogout(); handleClose(); }}>
                Logout
              </MenuItem>
            )}
          </Menu>
        </Box>
        {/* Mobile Navigation */}
        <Box sx={{ flexGrow: 1, display: { xs: 'flex', '800': 'none' }, justifyContent: 'flex-end', alignItems: 'center' }}>
          <WeatherWidget sx={{ display: { xs: 'block', sm: 'none' } }} /> {/* Show only 600px+ */}
          <IconButton
            size="large"
            color="inherit"
            onClick={handleMenu}
            sx={{ ml: 1 }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{ style: { width: '200px' } }}
          >
            {mobileMenuItems.map((item) => (
              <MenuItem
                key={item.label}
                onClick={() => {
                  item.action ? item.action() : navigate(item.path!);
                  handleClose();
                }}
              >
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