import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: '#e0e0e0', // Light grey
        pt: 2, // Reduced padding-top (16px)
        pb: 3, // Reduced padding-bottom (24px)
        textAlign: 'center',
        position: 'fixed',
        bottom: 0,
        width: '100%',
        zIndex: 1100,
        borderTop: '4px solid #1b75bc', // Blue line to match navbar
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <img
        src="/RoofGrid320x63.png"
        alt="RoofGrid UK"
        style={{ maxHeight: '30px', width: 'auto', marginBottom: '8px' }} // Reduced spacing
      />
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
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
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        © {new Date().getFullYear()} RoofGrid UK. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;