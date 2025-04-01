// frontend/src/pages/ProTips.tsx
import React from 'react';
import { Box, Container, Typography, Button, Divider, Fade } from '@mui/material';
import PageLayout from '../components/PageLayout';
import MeasureIcon from '@mui/icons-material/Straighten';
import TileIcon from '@mui/icons-material/ViewModule';
import ProjectIcon from '@mui/icons-material/Folder';
import WeatherIcon from '@mui/icons-material/WbSunny';
import SettingsIcon from '@mui/icons-material/Settings';
import BondIcon from '@mui/icons-material/Link';
import ProIcon from '@mui/icons-material/Star';
import UpdateIcon from '@mui/icons-material/Update';

const tips = [
  {
    icon: <MeasureIcon sx={{ fontSize: 40, color: '#1b75bc' }} aria-label="Measure" />,
    title: 'Accurate Measurements',
    description: 'Double-check your roof dimensions for precise material estimates.',
  },
  {
    icon: <TileIcon sx={{ fontSize: 40, color: '#1b75bc' }} aria-label="Tiles" />,
    title: 'Custom Tiles',
    description: 'Save custom tile profiles for quick reuse across projects.',
  },
  {
    icon: <ProjectIcon sx={{ fontSize: 40, color: '#1b75bc' }} aria-label="Projects" />,
    title: 'Project Management',
    description: 'Organize multiple jobs with saved project files (Pro feature).',
  },
  {
    icon: <WeatherIcon sx={{ fontSize: 40, color: '#1b75bc' }} aria-label="Weather" />,
    title: 'Weather Planning',
    description: 'Use our weather widget to schedule work around forecasts.',
  },
  {
    icon: <SettingsIcon sx={{ fontSize: 40, color: '#1b75bc' }} aria-label="Settings" />,
    title: 'Settings Configuration',
    description: 'Optimize ridge and verge settings for tailored results.',
  },
  {
    icon: <BondIcon sx={{ fontSize: 40, color: '#1b75bc' }} aria-label="Bond" />,
    title: 'Cross-Bonding',
    description: 'Enhance roof stability with cross-bonding techniques.',
  },
  {
    icon: <ProIcon sx={{ fontSize: 40, color: '#1b75bc' }} aria-label="Pro" />,
    title: 'Utilize Pro Features',
    description: 'Access advanced tools like tile libraries with a Pro account.',
  },
  {
    icon: <UpdateIcon sx={{ fontSize: 40, color: '#1b75bc' }} aria-label="Update" />,
    title: 'Stay Updated',
    description: 'Keep the app updated for the latest features and fixes.',
  },
];

const heroStyles = {
  width: '100%',
  height: { xs: '300px', md: '400px' },
  backgroundImage: 'url(/images/uk-pitched-roof.jpg)', // Consistent with homepage
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  mb: 0, // Minimal space below hero to match homepage and login
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
  mt: 8, // Matches homepage and login for vertical centering
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

const ProTips: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Hero Section */}
      <Box sx={heroStyles}>
        <Typography variant="h2" sx={titleStyles}>
          Pro Tips for Roofers
        </Typography>
        <Typography variant="subtitle1" sx={subtitleStyles}>
          Maximize Your Roofing Efficiency
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
            href="/profile"
            sx={{ 
              bgcolor: '#1b75bc', 
              '&:hover': { bgcolor: '#145ea8' }, 
              minWidth: { xs: 160, md: 200 },
              py: 1,
            }}
          >
            Upgrade to Pro
          </Button>
          <Button
            variant="outlined"
            size="large"
            href="/calculator"
            sx={{ 
              color: 'white', 
              borderColor: 'white', 
              '&:hover': { borderColor: '#f5f5f5', color: '#f5f5f5' }, 
              minWidth: { xs: 160, md: 200 },
              py: 1,
            }}
          >
            Try the Calculator
          </Button>
        </Box>
      </Box>

      {/* Content wrapped in PageLayout */}
      <PageLayout>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1b75bc', textAlign: 'center', mb: 4 }}>
          Pro Tips for Roofers
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {tips.map((tip, index) => (
            <Fade in timeout={500} key={tip.title}>
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {tip.icon}
                  <Typography variant="h5" sx={{ color: '#1b75bc' }}>
                    {tip.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {tip.description}
                  </Typography>
                </Box>
                {index < tips.length - 1 && <Divider sx={{ my: 4, borderColor: '#ddd' }} />}
              </Box>
            </Fade>
          ))}
        </Box>
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            href="/profile"
            sx={{ bgcolor: '#1b75bc', '&:hover': { bgcolor: '#145ea8' }, minWidth: { xs: 200, md: 240 }, py: 1.5 }}
          >
            Upgrade to Pro Now
          </Button>
        </Box>
      </PageLayout>
    </Box>
  );
};

export default ProTips;