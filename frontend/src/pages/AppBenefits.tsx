// frontend/src/pages/AppBenefits.tsx
import React from 'react';
import { Box, Typography, Button, Grid, Fade } from '@mui/material';
import PageLayout from '../components/PageLayout';
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

const heroStyles = {
  width: '100%',
  height: { xs: '300px', md: '400px' },
  backgroundImage: 'url(/images/uk-pitched-roof.jpg)', // Same image as homepage
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  mb: 0, // Minimal space below hero to match other pages
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    bgcolor: 'rgba(0, 0, 0, 0.4)', // Dark overlay for text readability
  },
};

const titleStyles = {
  color: 'white',
  fontSize: { xs: 28, md: 36 },
  fontWeight: 'bold',
  textTransform: 'uppercase',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
  zIndex: 1,
  textAlign: 'center',
  maxWidth: '90%',
  mt: 8, // Matches other pages for vertical centering
};

const subtitleStyles = {
  color: 'white',
  mt: 1,
  fontSize: { xs: 16, md: 20 },
  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
  zIndex: 1,
  textAlign: 'center',
  maxWidth: '90%',
};

const AppBenefits: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Hero Section */}
      <Box sx={heroStyles}>
        <Typography variant="h2" sx={titleStyles}>
          Why RoofGrid UK?
        </Typography>
        <Typography variant="subtitle1" sx={subtitleStyles}>
          Discover the benefits of precision roofing
        </Typography>
        <Box sx={{ 
          mt: 2, 
          mb: 1, 
          display: 'flex', 
          gap: 2, 
          flexWrap: 'wrap', 
          justifyContent: 'center', 
          alignItems: 'center',
          zIndex: 1,
        }}>
          <Button
            variant="contained"
            size="large"
            href="/calculator"
            sx={{ 
              bgcolor: '#1b75bc', 
              '&:hover': { bgcolor: '#145ea8' }, 
              minWidth: { xs: 160, md: 200 },
              py: 1,
            }}
          >
            Try the Calculator
          </Button>
          <Button
            variant="outlined"
            size="large"
            href="/register"
            sx={{ 
              color: 'white', 
              borderColor: 'white', 
              '&:hover': { borderColor: '#f5f5f5', color: '#f5f5f5' }, 
              minWidth: { xs: 160, md: 200 },
              py: 1,
            }}
          >
            Sign Up Free
          </Button>
        </Box>
      </Box>

      {/* Content wrapped in PageLayout */}
      <PageLayout>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#1b75bc', textAlign: 'center' }}>
          Why RoofGrid UK?
        </Typography>
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
          <Button
            variant="contained"
            size="large"
            href="/calculator"
            sx={{ bgcolor: '#1b75bc', '&:hover': { bgcolor: '#145ea8' }, minWidth: { xs: 200, md: 240 }, py: 1.5 }}
          >
            Try the Calculator Now
          </Button>
        </Box>
      </PageLayout>
    </Box>
  );
};

export default AppBenefits;