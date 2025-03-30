import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Disclaimer: React.FC = () => (
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
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: '#1b75bc' }}>
          Disclaimer
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          <strong>Last Updated:</strong> March 29, 2025
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          RoofGrid UK provides this web-based roofing calculator application ("the App") as a tool to assist roofing professionals and homeowners in planning and executing roofing projects. The information provided by the App is for general informational purposes only and should not be considered professional advice. By using the App, you acknowledge and agree to the following disclaimers.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          1. No Warranty
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          The App is provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied, including but not limited to warranties of accuracy, reliability, or fitness for a particular purpose. RoofGrid UK does not guarantee that the App will be error-free, uninterrupted, or free of viruses or other harmful components.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          2. Accuracy of Calculations
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          The roofing calculations provided by the App (e.g., batten positions, tile placement, material estimates) are based on the data you input, such as tile dimensions and roof measurements. RoofGrid UK is not responsible for any errors, omissions, or inaccuracies in the calculations resulting from incorrect or incomplete user-entered data. It is your responsibility to verify all calculations and ensure compliance with relevant standards (e.g., BS 5534) before proceeding with any roofing project.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          3. Third-Party Services
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          The App integrates with third-party services, such as OpenWeatherMap (for weather data) and Postcodes.io (for postcode-to-coordinates conversion). RoofGrid UK does not control these third-party services and is not responsible for their availability, accuracy, or reliability. Any use of third-party services is subject to their respective terms and conditions.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          4. Limitation of Liability
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          To the fullest extent permitted by law, RoofGrid UK shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the App, including but not limited to damages for loss of profits, data, or other intangible losses. This includes damages resulting from errors in calculations, reliance on weather data, or any other use of the App.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          5. Professional Advice
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          The App is not a substitute for professional roofing advice. You should consult a qualified roofing professional or contractor for advice specific to your project, especially for complex or large-scale roofing work. RoofGrid UK is not responsible for any decisions or actions taken based on the information provided by the App.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          6. Contact Us
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          If you have any questions about this Disclaimer, please contact us at support@roofgrid.uk
        </Typography>
      </Container>
    </Box>
    <Footer />
  </Box>
);

export default Disclaimer;