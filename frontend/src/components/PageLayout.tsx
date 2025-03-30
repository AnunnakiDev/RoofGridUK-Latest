// frontend/src/components/PageLayout.tsx
import React from 'react';
import { Box, Container, Fade } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Navbar />
      <Box
        sx={{
          flexGrow: 1,
          pt: { xs: 8, md: 10 }, // Space for navbar
          pb: { xs: 12, md: 16 }, // Space for footer
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <Container maxWidth="md" sx={{ py: 6, px: { xs: 4, md: 0 } }}>
          <Fade in timeout={500}>
            <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
              {children}
            </Box>
          </Fade>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default PageLayout;