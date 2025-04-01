import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Box, IconButton, Menu, MenuItem, Button, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CalculateIcon from '@mui/icons-material/Calculate';
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

  const handleCalculatorClick = () => {
    if (user.id) {
      navigate('/calculator');
    } else {
      navigate('/register');
    }
  };

  // Static pages for burger menu
  const staticItems: NavItem[] = [
    { label: 'Home', path: '/' },
    { label: 'How to Use', path: '/how-to-use' },
    { label: 'App Benefits', path: '/app-benefits' },
    { label: 'Pro Tips', path: '/pro-tips' },
    { label: 'Resources', path: '/resources' },
    { label: 'FAQ', path: '/faq' },
  ];

  // Dynamic items based on user state (for main navbar)
  const dynamicItems: NavItem[] = !user.id
    ? [
        { label: 'Calculator', path: '/calculator', action: handleCalculatorClick },
        { label: 'Login', path: '/login' },
      ]
    : [
        { label: 'Calculator', path: '/calculator', action: handleCalculatorClick },
      ];

  // Admin item if applicable
  const adminItems: NavItem[] = user.role === 'admin' ? [{ label: 'Admin Dashboard', path: '/admin/profile' }] : [];

  // Items for mobile menu (burger menu)
  const mobileMenuItems: NavItem[] = !user.id
    ? [
        { label: 'Calculator', path: '/calculator', action: handleCalculatorClick },
        { label: 'Login', path: '/login' },
        ...staticItems,
      ]
    : [
        ...adminItems,
        { label: 'Calculator', path: '/calculator', action: handleCalculatorClick },
        ...staticItems,
        { label: 'Logout', action: handleLogout },
      ];

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: '#ffffff',
        color: '#1b75bc', // Primary blue for all text and icons
        borderTop: '4px solid #1b75bc',
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
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: 'none', '800': 'flex' },
            justifyContent: 'flex-end',
            alignItems: 'center',
            overflow: 'visible', // Ensure no clipping
          }}
        >
          <WeatherWidget
            sx={{
              display: { xs: 'none', sm: 'block' },
              mr: 2,
              visibility: 'visible',
              opacity: 1,
            }}
          />
          {dynamicItems.map((item) => (
            item.label === 'Calculator' ? (
              <Tooltip title="Calculator" key={item.label}>
                <IconButton
                  color="inherit"
                  onClick={item.action ? item.action : () => navigate(item.path!)}
                  sx={{ mx: 1 }}
                >
                  <CalculateIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Button
                key={item.label}
                color="inherit"
                onClick={item.action ? item.action : () => navigate(item.path!)}
                sx={{ mx: 1, fontSize: '1rem', textTransform: 'none' }}
              >
                {item.label}
              </Button>
            )
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
          {user.id && (
            <Button
              color="inherit"
              onClick={handleLogout}
              sx={{ mx: 1, fontSize: '1rem', textTransform: 'none' }}
            >
              Logout
            </Button>
          )}
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
        {/* Mobile Navigation */}
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: 'flex', '800': 'none' },
            justifyContent: 'flex-end',
            alignItems: 'center',
            overflow: 'visible', // Ensure no clipping
          }}
        >
          <WeatherWidget
            sx={{
              display: { xs: 'block', sm: 'none' },
              mr: 1,
              visibility: 'visible',
              opacity: 1,
            }}
          />
          {dynamicItems.map((item) => (
            item.label === 'Calculator' ? (
              <Tooltip title="Calculator" key={item.label}>
                <IconButton
                  color="inherit"
                  onClick={item.action ? item.action : () => navigate(item.path!)}
                  sx={{ mx: 1 }}
                >
                  <CalculateIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Button
                key={item.label}
                color="inherit"
                onClick={item.action ? item.action : () => navigate(item.path!)}
                sx={{ mx: 1, fontSize: '0.875rem', textTransform: 'none' }}
              >
                {item.label}
              </Button>
            )
          ))}
          {user.id && (
            <Button
              color="inherit"
              onClick={handleLogout}
              sx={{ mx: 1, fontSize: '0.875rem', textTransform: 'none' }}
            >
              Logout
            </Button>
          )}
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