import React from 'react';
import { Box, Container, Typography, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useUser } from '../context/UserContext';

const features = [
  {
    title: 'Speed Up Workflow',
    description: 'Automate calculations, save time on-site.',
    image: '/images/home/workflow.png',
  },
  {
    title: 'Accurate Results',
    description: 'BS 5534-compliant precision for tiles and battens.',
    image: '/images/home/results.png',
  },
  {
    title: 'Pro Features',
    description: 'Full tile library, saved projects, and advanced tools.',
    image: '/images/home/library.png',
  },
  {
    title: 'Mobile-Friendly',
    description: 'Works offline, anywhere, on any device.',
    image: '/images/home/mobile.png',
  },
];

const comparisonData = [
  { feature: 'Calculator', free: 'Yes', pro: 'Yes', freeDesc: 'Basic calculations', proDesc: 'Advanced calculations' },
  { feature: 'Full Tile Library', free: 'No', pro: 'Yes', freeDesc: 'Limited options', proDesc: 'Access all tiles' },
  { feature: 'Manual Input', free: 'Yes', pro: 'Yes', freeDesc: 'Basic inputs', proDesc: 'Custom inputs' },
  { feature: 'Save Custom Tiles', free: 'No', pro: 'Yes', freeDesc: 'Not available', proDesc: 'Save your tiles' },
  { feature: 'Saved Projects', free: 'No', pro: 'Yes', freeDesc: 'Not available', proDesc: 'Store projects' },
  { feature: 'Professional Reports', free: 'No', pro: 'Yes', freeDesc: 'Not available', proDesc: 'Detailed reports' },
  { feature: 'Weather Integration', free: 'Yes', pro: 'Yes', freeDesc: 'Basic weather', proDesc: 'Enhanced weather' },
  { feature: 'Priority Support', free: 'No', pro: 'Yes', freeDesc: 'Standard support', proDesc: '24-hour priority' },
  { feature: 'No Ads', free: 'No', pro: 'Yes', freeDesc: 'Ads included', proDesc: 'Ad-free experience' },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Navbar />
      <Box
        sx={{
          flexGrow: 1,
          pt: { xs: 8, md: 10 }, // Reduced top padding to pull content up
          pb: { xs: 12, md: 16 }, // Increased bottom padding for footer clearance
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start', // Shift content toward top
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
            Precision Roofing Made Simple
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
            Calculate tiles, battens, and more in seconds
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', zIndex: 1 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/calculator')}
              sx={{ bgcolor: '#1b75bc', '&:hover': { bgcolor: '#145ea8' }, minWidth: { xs: 160, md: 200 } }}
            >
              Try the Calculator
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: '#f5f5f5', color: '#f5f5f5' }, minWidth: { xs: 160, md: 200 } }}
            >
              Sign Up Free
            </Button>
          </Box>
        </Box>

        {/* Features Section */}
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1b75bc', textAlign: 'center', mb: 6 }}>
            Why RoofGrid UK?
          </Typography>
          {features.map((feature, index) => (
            <Fade in timeout={500} key={feature.title}>
              <Grid
                container
                spacing={6}
                sx={{ mb: 6, flexDirection: { xs: 'column', md: index % 2 === 0 ? 'row' : 'row-reverse' } }}
              >
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h5" sx={{ color: '#1b75bc', fontWeight: 'bold' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <img
                      src={feature.image}
                      alt={feature.title}
                      loading="lazy"
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Fade>
          ))}
        </Container>

        {/* Free vs Pro Comparison Section */}
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1b75bc', textAlign: 'center', mb: 4 }}>
            Free vs. Pro
          </Typography>
          <Box sx={{ bgcolor: 'white', border: '1px solid #ddd', borderRadius: 2, p: 3, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
            <Table sx={{ borderCollapse: 'collapse' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>Feature</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', borderBottom: '2px solid #ddd', textAlign: 'center' }}>Free</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1b75bc', color: 'white', borderBottom: '2px solid #ddd', textAlign: 'center' }}>
                    Pro
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {comparisonData.map((row) => (
                  <TableRow key={row.feature}>
                    <TableCell sx={{ borderBottom: '1px solid #ddd' }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {row.feature}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                      <Typography variant="body2">{row.free}</Typography>
                      <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                        {row.freeDesc}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #ddd', bgcolor: '#1b75bc20', textAlign: 'center' }}>
                      <Typography variant="body2">{row.pro}</Typography>
                      <Typography variant="caption" sx={{ fontStyle: 'italic', color: '#1b75bc' }}>
                        {row.proDesc}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Container>

        {/* CTA Section */}
        <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1b75bc', mb: 3 }}>
            Ready to Roof Smarter?
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(user.id ? '/calculator' : '/register')}
            sx={{ bgcolor: '#1b75bc', '&:hover': { bgcolor: '#145ea8' }, minWidth: { xs: 200, md: 240 }, py: 1.5 }}
          >
            {user.id ? 'Start Calculating' : 'Sign Up Now'}
          </Button>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Home;