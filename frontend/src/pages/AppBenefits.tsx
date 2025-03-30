import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AppBenefits: React.FC = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <Box
      sx={{
        flexGrow: 1,
        pt: { xs: '64px', md: '80px' },
        pb: { xs: '100px', md: '120px' },
        bgcolor: '#f5f5f5',
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: '#1b75bc',
          color: 'white',
          py: { xs: 6, md: 8 },
          textAlign: 'center',
          background: 'linear-gradient(135deg, #1b75bc 0%, #0d47a1 100%)',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '2.5rem', md: '4rem' } }}>
            Benefits of RoofGrid UK
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
            Discover How RoofGrid UK Can Transform Your Roofing Projects
          </Typography>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 6, color: '#1b75bc' }}>
          Why RoofGrid UK?
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1b75bc' }}>
                  Save Time and Effort
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  RoofGrid UK streamlines your workflow by automating complex roofing calculations. Measure your roof once, input the data, and let the app handle the rest—saving you hours of manual work.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1b75bc' }}>
                  Ensure Accuracy
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Our calculator ensures precise batten positions and tile placement, helping you comply with BS 5534 standards. Avoid costly mistakes with real-time validation of your inputs.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1b75bc' }}>
                  Work Anywhere
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  With a mobile-friendly design and offline capability, RoofGrid UK lets you perform calculations on-site, even in rural areas with limited connectivity.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1b75bc' }}>
                  Unlock Pro Features
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Upgrade to Pro to access the full tile library, save custom tiles, and manage projects. Store your work securely and revisit it anytime, all for a small subscription fee.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1b75bc' }}>
                  Stay Informed with Weather Data
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Plan your projects with confidence using real-time weather data. RoofGrid UK integrates with OpenWeatherMap to provide forecasts, helping you schedule work around the weather.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1b75bc' }}>
                  User-Friendly Interface
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Designed with simplicity in mind, RoofGrid UK offers an intuitive interface with tooltips and real-time validation, making it easy for both professionals and DIY enthusiasts to use.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
    <Footer />
  </Box>
);

export default AppBenefits;