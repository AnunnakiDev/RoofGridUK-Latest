import React from 'react';
import { Box, Container, Typography, Button, Grid, Fade } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AccountIcon from '@mui/icons-material/AccountCircle';
import CalcIcon from '@mui/icons-material/Calculate';
import TileIcon from '@mui/icons-material/ViewModule';
import DimensionsIcon from '@mui/icons-material/Straighten';
import SettingsIcon from '@mui/icons-material/Settings';
import ResultsIcon from '@mui/icons-material/BarChart';
import SaveIcon from '@mui/icons-material/Save';

const steps = [
  {
    icon: <AccountIcon sx={{ fontSize: 40, color: '#1b75bc' }} aria-label="Account" />,
    title: '1. Create an Account',
    description: 'Sign up to save your projects and unlock Pro features.',
    image: '/images/how-to-use/create-account.png',
  },
  {
    icon: <CalcIcon sx={{ fontSize: 40, color: '#1b75bc' }} aria-label="Calculator" />,
    title: '2. Access the Calculator',
    description: 'Navigate to the calculator to start a new roofing project.',
    image: '/images/how-to-use/access-calculator.png',
  },
  {
    icon: <TileIcon sx={{ fontSize: 40, color: '#1b75bc' }} aria-label="Tiles" />,
    title: '3. Choose Your Tile',
    description: 'Select from our library or input custom tile dimensions.',
    image: '/images/how-to-use/choose-tile.png',
  },
  {
    icon: <DimensionsIcon sx={{ fontSize: 40, color: '#1b75bc' }} aria-label="Dimensions" />,
    title: '4. Enter Dimensions',
    description: 'Input your roof measurements for accurate calculations.',
    image: '/images/how-to-use/enter-dimensions.png',
  },
  {
    icon: <SettingsIcon sx={{ fontSize: 40, color: '#1b75bc' }} aria-label="Settings" />,
    title: '5. Configure Settings',
    description: 'Adjust ridge, verge, and other settings as needed.',
    image: '/images/how-to-use/configure-settings.png',
  },
  {
    icon: <ResultsIcon sx={{ fontSize: 40, color: '#1b75bc' }} aria-label="Results" />,
    title: '6. View Results',
    description: 'Review tile counts, battens, and more in detailed outputs.',
    image: '/images/how-to-use/view-results.png',
  },
  {
    icon: <SaveIcon sx={{ fontSize: 40, color: '#1b75bc' }} aria-label="Save" />,
    title: '7. Save Your Project',
    description: 'Store your work for later use with a Pro account.',
    image: '/images/how-to-use/save-project.png',
  },
];

const HowToUse: React.FC = () => {
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
            How To Use RoofGrid UK
          </Typography>
          <Button
            variant="outlined"
            href="/calculator"
            sx={{ mt: 2, color: 'white', borderColor: 'white', zIndex: 1 }}
          >
            Start Calculating
          </Button>
        </Box>

        {/* Steps Section - More Width Padding on Small Screens */}
        <Container
          maxWidth="lg"
          sx={{
            py: 6,
            px: { xs: 4, md: 0 }, // Added horizontal padding on smaller screens
          }}
        >
          {steps.map((step, index) => (
            <Fade in timeout={500} key={step.title}>
              <Grid
                container
                spacing={6}
                sx={{ mb: 6, flexDirection: { xs: 'column', md: index % 2 === 0 ? 'row' : 'row-reverse' } }}
              >
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {step.icon}
                    <Typography variant="h5" sx={{ color: '#1b75bc' }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {step.description}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <img
                      src={step.image}
                      alt={step.title}
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
              Start Calculating Now
            </Button>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default HowToUse;