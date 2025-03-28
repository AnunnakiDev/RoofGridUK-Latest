import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useUser } from '../context/UserContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box
        sx={{
          flexGrow: 1,
          pt: { xs: '64px', md: '80px' }, // Adjust for Navbar height + safe area
          pb: { xs: '80px', md: '100px' }, // Adjust for Footer height + safe area
        }}
      >
        {/* Hero Section */}
        <Box
          sx={{
            bgcolor: '#1b75bc',
            color: 'white',
            py: { xs: 6, md: 10 },
            textAlign: 'center',
            background: 'linear-gradient(135deg, #1b75bc 0%, #0d47a1 100%)',
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '2.5rem', md: '4rem' } }}>
              RoofGrid UK
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
              Precision Roofing Calculations for Professionals
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate('/calculator')}
              sx={{ bgcolor: 'white', color: '#1b75bc', fontSize: '1.2rem', py: 1.5, px: 4, '&:hover': { bgcolor: '#f5f5f5' } }}
            >
              Try the Calculator Now
            </Button>
          </Container>
        </Box>

        {/* Features Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 6, color: '#1b75bc' }}>
            Why Choose RoofGrid UK?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1b75bc' }}>
                    Speed up Work Flow
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Optimise your workflow. Measure once, or twice to be sure; and let RoofGrid work out what goes where.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1b75bc' }}>
                    Accurate Calculations
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Ensure compliance with BS 5534 standards with precise batten positions and tile placement using chalk lines.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1b75bc' }}>
                    Pro Features
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Access the full tile and slate library for predefined tile data. Save projects, add and manage personal tiles that are not in the library, and access advanced tools with a Pro subscription.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1b75bc' }}>
                    Mobile-Friendly
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Use RoofGrid UK on-site with a fully responsive design optimized for all devices and with offline capability for rural sites.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* CTA Section */}
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Container maxWidth="lg">
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: '#1b75bc' }}>
              Ready to Step up your Game?
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate(user.id ? '/calculator' : '/register')}
              sx={{ fontSize: '1.2rem', py: 1.5, px: 4 }}
            >
              {user.id ? 'Start Calculating' : 'Sign Up Now'}
            </Button>
          </Container>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Home;