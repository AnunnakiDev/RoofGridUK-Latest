import React, { useState } from 'react';
import { Box, Container, Drawer, List, ListItem, ListItemButton, ListItemText, IconButton, Typography, Divider } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import Navbar from './Navbar';
import Footer from './Footer';
import { useUser } from '../context/UserContext';

const AdminLayout: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/profile' },
    { label: 'Saved Projects', path: '/admin/projects' },
    ...(user.subscription === 'pro' ? [{ label: 'Personal Tiles', path: '/admin/personal-tiles' }] : []),
    { label: 'Tile Management', path: '/admin/tile-management' },
    { label: 'User Management', path: '/admin/user-management' },
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold', color: '#1b75bc' }}>
        Admin Navigation
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton onClick={() => { navigate(item.path); setMobileOpen(false); }}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {/* Sidebar Drawer for Desktop and Mobile */}
        <Box
          component="nav"
          sx={{ width: { sm: 250 }, flexShrink: { sm: 0 } }}
        >
          {/* Mobile Drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
            }}
          >
            {drawer}
          </Drawer>
          {/* Permanent Drawer for Desktop */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250, top: { sm: '64px', md: '80px' } },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: { xs: '64px', md: '80px' },
            pb: { xs: '80px', md: '100px' },
            width: { sm: 'calc(100% - 250px)' },
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: 'none' }, position: 'fixed', top: 16, left: 16, zIndex: 1200 }}
          >
            <MenuIcon />
          </IconButton>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Outlet />
          </Container>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default AdminLayout;