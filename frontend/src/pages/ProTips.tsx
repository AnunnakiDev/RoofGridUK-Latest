import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProTips: React.FC = () => (
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
            Pro Tips for RoofGrid UK
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
            Expert Advice to Elevate Your Roofing Projects
          </Typography>
        </Container>
      </Box>

      {/* Tips Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: '#1b75bc' }}>
          Maximize Your Roofing Efficiency
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          RoofGrid UK is packed with features to help roofing professionals work smarter. Here are some expert tips to get the most out of the app and improve your roofing projects.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          1. Double-Check Your Measurements
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          Before using the Calculator, measure your roof dimensions twice to ensure accuracy. Small errors in rafter heights or widths can lead to incorrect batten positions. RoofGrid UK provides real-time validation (e.g., ensuring tile length > 0, min gauge ≤ max gauge), but accurate inputs are key to reliable results.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          2. Save Custom Tiles for Efficiency (Pro Users)
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          If you frequently work with specific tiles that aren’t in the default library, save them as custom tiles in the Calculator. This allows you to quickly select them for future projects, saving time on data entry. Organize your custom tiles in the Profile page by deleting outdated ones to keep your list manageable.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          3. Use Projects to Track Your Work (Pro Users)
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          Save your calculations as projects with descriptive names (e.g., “Smith Residence - Main Roof”). This makes it easy to revisit past work, especially for large or multi-phase projects. In the Profile page, use the “Saved Projects” accordion to review or delete projects as needed.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          4. Plan Around the Weather
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          Use the Weather Widget to check the 5-day forecast before starting a project. Avoid scheduling outdoor work during heavy rain or high winds, which can affect safety and tile installation. If you’re working in a new area, enter the postcode to get accurate weather data for that location.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          5. Optimize for BS 5534 Compliance
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          RoofGrid UK helps you comply with BS 5534 standards by calculating precise batten gauges and tile placements. After getting your results, double-check the vertical and horizontal results to ensure they meet the standard’s requirements for your specific tile type and roof pitch.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          6. Work Offline in Rural Areas
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          If you’re working in a rural area with limited internet, take advantage of RoofGrid UK’s offline capability. Perform your calculations and save your work (Pro users) while offline—your data will sync to the backend once you’re back online.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          7. Use Tooltips for Guidance
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          The Calculator includes tooltips for each field (e.g., tile dimensions, settings). Hover over these tooltips to get quick guidance on what each input means, ensuring you enter the correct data and avoid validation errors.
        </Typography>
      </Container>
    </Box>
    <Footer />
  </Box>
);

export default ProTips;