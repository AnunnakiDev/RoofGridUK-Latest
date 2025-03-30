import React from 'react';
import { Box, Container, Typography, Button, Grid, Divider, Fade } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Resources: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Navbar />
      <Box
        sx={{
          flexGrow: 1,
          pt: { xs: 8, md: 10 },
          pb: { xs: 12, md: 16 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        {/* Hero Section */}
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
            Resources
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: 'white',
              mt: 1,
              fontSize: { xs: 16, md: 20 },
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
              zIndex: 1,
              textAlign: 'center',
            }}
          >
            Tools, Guides, and References for Roofing Success
          </Typography>
        </Box>

        {/* Content Section */}
        <Container maxWidth="md" sx={{ py: 6, px: { xs: 4, md: 0 } }}>
          <Fade in timeout={500}>
            <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
              {/* User Guides */}
              <Typography variant="h4" sx={{ color: '#1b75bc', fontWeight: 'bold', mb: 3 }}>
                User Guides
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" sx={{ color: '#1b75bc', mb: 1 }}>
                    Using the Calculator
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Plan roofing projects with precision:
                    <ol>
                      <li>Go to <strong>/calculator</strong>.</li>
                      <li>Enter dimensions in mm (e.g., length: 10,000mm, width: 5,000mm) and pitch (e.g., 30°). Conversion from meters/inches coming soon.</li>
                      <li>Select tile specs (e.g., 420x330mm) or use a custom tile.</li>
                      <li>Review: tiles needed, battens, waste %.</li>
                    </ol>
                    <strong>Tip:</strong> Verify inputs on-site per BS 5534—accuracy matters!
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" sx={{ color: '#1b75bc', mb: 1 }}>
                    Weather Widget
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Add weather insights:
                    <ol>
                      <li>Enable geolocation or input a postcode (e.g., SW1A 1AA).</li>
                      <li>Data updates hourly—clear cache for freshness.</li>
                    </ol>
                    <strong>Tip:</strong> Check wind speed for safe scheduling.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" sx={{ color: '#1b75bc', mb: 1 }}>
                    Pro Features
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Advanced tools for Pro users:
                    <ul>
                      <li><strong>Custom Tiles:</strong> Save at <strong>/custom-tiles</strong>.</li>
                      <li><strong>Projects:</strong> Manage at <strong>/saved-projects</strong>.</li>
                      <li><strong>Reports:</strong> Export PDFs with weather data.</li>
                    </ul>
                    <strong>Tip:</strong> Impress clients with ad-free reports!
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ my: 4 }} />

              {/* Roofing References */}
              <Typography variant="h4" sx={{ color: '#1b75bc', fontWeight: 'bold', mb: 3 }}>
                Roofing References
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" sx={{ color: '#1b75bc', mb: 1 }}>
                    BS 5534 Standards
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    UK code for slating/tiling (2014+A2:2018):
                    <ul>
                      <li>All single-lap tiles need mechanical fixing (nail/clip).</li>
                      <li>Perimeter tiles: 2 fixings min.</li>
                      <li>Battens graded to BS 5534.</li>
                      <li>Underlays resist wind uplift (max 15mm drape).</li>
                    </ul>
                    <strong>Note:</strong> Applies to new builds and repairs—see full standard for details.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" sx={{ color: '#1b75bc', mb: 1 }}>
                    Tile Manufacturers & Fixings
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Top UK brands align with BS 5534:
                    <ul>
                      <li><strong>Marley:</strong> Modern tiles (420x330mm), SoloFix clips.</li>
                      <li><strong>Redland:</strong> Concrete tiles, nail/clip options.</li>
                      <li><strong>Wienerberger:</strong> Clay tiles, fixing guides.</li>
                    </ul>
                    <strong>Fixing Specs:</strong> Site-specific—use manufacturer tools for wind load calculations.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" sx={{ color: '#1b75bc', mb: 1 }}>
                    Pitch Conversion & Headlaps
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Pitch (degrees) to min headlap (mm):
                    <ul>
                      <li><strong>20°:</strong> 100 (severe), 75 (moderate), 65 (sheltered).</li>
                      <li><strong>30°:</strong> 75 (severe), 55 (moderate), 45 (sheltered).</li>
                      <li><strong>45°:</strong> 55 (severe), 35 (moderate), 25 (sheltered).</li>
                    </ul>
                    <strong>Tip:</strong> Lower pitch = larger headlap for weather resistance.
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ my: 4 }} />

              {/* FAQs */}
              <Typography variant="h4" sx={{ color: '#1b75bc', fontWeight: 'bold', mb: 3 }}>
                FAQs
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                <strong>How do I upgrade to Pro?</strong> Log in, go to <strong>/profile</strong>, and upgrade for instant access.
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                <strong>Why isn’t weather data loading?</strong> Check connection, permissions, or clear cache.
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                <strong>Can I use it offline?</strong> Calculator works offline; Pro features need internet.
              </Typography>
              <Divider sx={{ my: 4 }} />

              {/* Downloads */}
              <Typography variant="h4" sx={{ color: '#1b75bc', fontWeight: 'bold', mb: 3 }}>
                Downloads
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Button
                    variant="outlined"
                    startIcon={<GetAppIcon />}
                    sx={{ color: '#1b75bc', borderColor: '#1b75bc', '&:hover': { bgcolor: '#1b75bc', color: 'white' } }}
                    fullWidth
                    href="/static/pre-roofing-checklist.pdf" // Update with actual path
                    download
                  >
                    Pre-Roofing Checklist (PDF)
                  </Button>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Checklist: measure roof, check weather, order materials.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Button
                    variant="outlined"
                    startIcon={<GetAppIcon />}
                    sx={{ color: '#1b75bc', borderColor: '#1b75bc', '&:hover': { bgcolor: '#1b75bc', color: 'white' } }}
                    fullWidth
                    href="/static/sample-pro-report.pdf" // Update with actual path
                    download
                  >
                    Sample Pro Report (PDF)
                  </Button>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Example report: tile counts, weather notes.
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ my: 4 }} />

              {/* External Links */}
              <Typography variant="h4" sx={{ color: '#1b75bc', fontWeight: 'bold', mb: 3 }}>
                External Links
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                <a href="https://openweathermap.org" target="_blank" rel="noopener noreferrer" style={{ color: '#1b75bc', textDecoration: 'underline' }}>
                  OpenWeatherMap
                </a>{' '}
                - Weather data source.
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                <a href="https://postcodes.io" target="_blank" rel="noopener noreferrer" style={{ color: '#1b75bc', textDecoration: 'underline' }}>
                  Postcodes.io
                </a>{' '}
                - Postcode-to-coordinates conversion.
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                <a href="https://www.nfrc.co.uk" target="_blank" rel="noopener noreferrer" style={{ color: '#1b75bc', textDecoration: 'underline' }}>
                  NFRC
                </a>{' '}
                - UK roofing standards and resources.
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                <a href="https://www.bsigroup.com/en-GB/standards/bs-5534/" target="_blank" rel="noopener noreferrer" style={{ color: '#1b75bc', textDecoration: 'underline' }}>
                  BS 5534 (BSI)
                </a>{' '}
                - Full standard for slating and tiling.
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Resources;