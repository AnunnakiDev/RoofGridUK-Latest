import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: '#f5f5f5',
        py: 3,
        textAlign: 'center',
        position: 'fixed', // Changed to fixed
        bottom: 0,
        width: '100%',
        zIndex: 1100,
        paddingBottom: 'env(safe-area-inset-bottom)', // Handle iPhone/Safari bottom inset
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 1 }}>
        <Link
          component="button"
          onClick={() => navigate('/disclaimer')}
          sx={{ color: '#1b75bc', textDecoration: 'none', fontSize: '1rem' }}
        >
          Disclaimer
        </Link>
        <Link
          component="button"
          onClick={() => navigate('/terms-of-service')}
          sx={{ color: '#1b75bc', textDecoration: 'none', fontSize: '1rem' }}
        >
          Terms of Service
        </Link>
        <Link
          component="button"
          onClick={() => navigate('/privacy-policy')}
          sx={{ color: '#1b75bc', textDecoration: 'none', fontSize: '1rem' }}
        >
          Privacy Policy
        </Link>
        <Link
          component="button"
          onClick={() => navigate('/contact')}
          sx={{ color: '#1b75bc', textDecoration: 'none', fontSize: '1rem' }}
        >
          Contact
        </Link>
      </Box>
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} RoofGrid UK. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;