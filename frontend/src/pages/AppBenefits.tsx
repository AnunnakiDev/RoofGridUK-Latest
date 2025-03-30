import React from 'react';
import { Box, Container, Typography, Button, Grid, Fade } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SpeedIcon from '@mui/icons-material/Speed';
import PrecisionIcon from '@mui/icons-material/PrecisionManufacturing';
import PhoneIcon from '@mui/icons-material/PhoneAndroid';
import StarIcon from '@mui/icons-material/Star';
import MoneyIcon from '@mui/icons-material/MonetizationOn';
import DecisionIcon from '@mui/icons-material/Assessment';

const benefits = [
  {
    icon: <SpeedIcon sx={{ fontSize: 40, color: '#1b75bc' }} aria-label="Speed" />,
    title: 'Speed Up Your Workflow',
    description: 'Automate calculations and manage projects efficiently with our intuitive tools.',
    image: '/images/app-benefits/speed-workflow.png',
  },
  {
    icon: <PrecisionIcon sx={{ fontSize: 40, color: '#1b75bc' }} aria-label="Accuracy" />,
    title: 'Accurate Results',
    description: 'Get precision based on UK roofing standards and manufacturer data.',
    image: '/images/app-benefits/accuracy-results.png',
  },
  {
    icon: <PhoneIcon sx={{ fontSize: 40, color: '#1b75bc' }} aria-label="Mobile" />,
    title: 'Mobile-Friendly',
    description: 'Use RoofGrid UK on-site with a fully responsive design for phones and tablets.',
    image: '/images/app-benefits/mobile-friendly.png',
  },
  {
    icon: <StarIcon sx={{ fontSize: 40, color: '#1b75bc' }} aria-label="Pro Features" />,
    title: 'Pro Features',
    description: 'Unlock advanced tools like project saving and custom tile libraries.',
    image: '/images/app-benefits/pro-features.png',
  },
  {
    icon: <MoneyIcon sx={{ fontSize: 40, color: '#1b75bc' }} aria-label="Cost" />,
    title: 'Cost-Effective',
    description: 'Free basic access with affordable Pro options to suit your budget.',
    image: '/images/app-benefits/cost-effective.png',
  },
  {
    icon: <DecisionIcon sx={{ fontSize: 40, color: '#1b75bc' }} aria-label="Decision" />,
    title: 'Enhanced Decisions',
    description: 'Make informed choices with weather integration and detailed outputs.',
    image: '/images/app-benefits/decision-making.png',
  },
];

const AppBenefits: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Navbar />
      <Box
        sx={{
          flexGrow: 1,
          pt: { xs: 8, md: 10 }, // Top padding for Navbar clearance
          pb: { xs: 12, md: 16 }, // Bottom padding for Footer clearance
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        {/* Hero Section - Full Width */}
        <Box
          sx={{
            width: '100%',
            height: { xs: '300px', md: '400px' },
            backgroundImage: 'url(/images/uk-pitched-roof.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0, 0, 0, 0.4)',
            },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: 'white',
              fontSize: { xs: 28, md: 36 },
              fontWeight: 'bold',
              textTransform: 'uppercase',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
              zIndex: 1,
              textAlign: 'center',
            }}
          >
            Why RoofGrid UK?
          </Typography>
          <Button
            variant="outlined"
            href="/calculator"
            sx={{ mt: 2, color: 'white', borderColor: 'white', zIndex: 1 }}
          >
            Try the Calculator
          </Button>
        </Box>

        {/* Benefits Section - More Width Padding on Small Screens */}
        <Container
          maxWidth="lg"
          sx={{
            py: 6,
            px: { xs: 4, md: 0 }, // Added horizontal padding on smaller screens
          }}
        >
          {benefits.map((benefit, index) => (
            <Fade in timeout={500} key={benefit.title}>
              <Grid
                container
                spacing={6}
                sx={{ mb: 6, flexDirection: { xs: 'column', md: index % 2 === 0 ? 'row' : 'row-reverse' } }}
              >
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {benefit.icon}
                    <Typography variant="h5" sx={{ color: '#1b75bc' }}>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {benefit.description}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <img
                      src={benefit.image}
                      alt={benefit.title}
                      loading="lazy"
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Fade>
          ))}
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Button variant="contained" size="large" href="/calculator" sx={{ bgcolor: '#1b75bc' }}>
              Try the Calculator Now
            </Button>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default AppBenefits;