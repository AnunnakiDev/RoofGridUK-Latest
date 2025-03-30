import React from 'react';
import { Box, Container, Typography, Divider, Fade } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Disclaimer: React.FC = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
    <Navbar />
    <Box
      sx={{
        flexGrow: 1,
        pt: { xs: 8, md: 10 }, // Updated to match standard
        pb: { xs: 12, md: 16 }, // Updated to match standard
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
          height: { xs: '200px', md: '400px' },
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
          Disclaimer
        </Typography>
      </Box>

      {/* Content Section */}
      <Container maxWidth="md" sx={{ py: 6, px: { xs: 4, md: 0 } }}>
        <Fade in timeout={500}>
          <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: '#1b75bc' }}>
              RoofGrid UK Disclaimer
            </Typography>
            <Typography paragraph sx={{ color: 'text.secondary' }}>
              <strong>Last Updated:</strong> March 30, 2025
            </Typography>
            <Typography paragraph sx={{ color: 'text.secondary' }}>
              RoofGrid UK provides this web-based roofing calculator application ("the App") as a tool to assist roofing professionals and homeowners in planning and executing roofing projects. The information provided by the App is for general informational purposes only and should not be considered professional advice. By using the App, you acknowledge and agree to the following disclaimers.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, mb: 2, color: '#1b75bc' }}>
              1. No Warranty
            </Typography>
            <Typography paragraph sx={{ color: 'text.secondary' }}>
              The App is provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied, including but not limited to warranties of accuracy, reliability, or fitness for a particular purpose. RoofGrid UK does not guarantee that the App will be error-free, uninterrupted, or free of viruses or other harmful components.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, mb: 2, color: '#1b75bc' }}>
              2. Accuracy of Calculations
            </Typography>
            <Typography paragraph sx={{ color: 'text.secondary' }}>
              The roofing calculations provided by the App (e.g., batten positions, tile placements) are based on the data you input, such as tile dimensions and roof measurements. RoofGrid UK is not responsible for any errors, omissions, or inaccuracies in the calculations resulting from incorrect or incomplete user-entered data. It is your responsibility to verify all calculations and ensure compliance with relevant standards (e.g., BS 5534) before proceeding with any roofing project.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, mb: 2, color: '#1b75bc' }}>
              3. Third-Party Services
            </Typography>
            <Typography paragraph sx={{ color: 'text.secondary' }}>
              The App integrates with third-party services, such as OpenWeatherMap (for weather data) and Postcodes.io (for postcode-to-coordinates conversion). RoofGrid UK does not control these third-party services and is not responsible for their availability, accuracy, or reliability. Any use of third-party services is subject to their respective terms and conditions.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, mb: 2, color: '#1b75bc' }}>
              4. Limitation of Liability
            </Typography>
            <Typography paragraph sx={{ color: 'text.secondary' }}>
              To the fullest extent permitted by law, RoofGrid UK shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the App, including but not limited to damages for loss of profits, data, or other intangible losses. This includes damages resulting from errors in calculations, reliance on weather data, or any other use of the App.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, mb: 2, color: '#1b75bc' }}>
              5. Professional Advice
            </Typography>
            <Typography paragraph sx={{ color: 'text.secondary' }}>
              The App is not a substitute for professional roofing advice. You should consult a qualified roofing professional or contractor for advice specific to your project, especially for complex or large-scale roofing work. RoofGrid UK is not responsible for any decisions or actions taken based on the information provided by the App.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, mb: 2, color: '#1b75bc' }}>
              6. Contact Us
            </Typography>
            <Typography paragraph sx={{ color: 'text.secondary' }}>
              If you have any questions about this Disclaimer, please contact us at{' '}
              <a href="mailto:support@roofgrid.uk" style={{ color: '#1b75bc', textDecoration: 'underline' }}>
                support@roofgrid.uk
              </a>.
            </Typography>
          </Box>
        </Fade>
      </Container>
    </Box>
    <Footer />
  </Box>
);

export default Disclaimer;