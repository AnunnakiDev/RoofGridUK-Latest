import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicy: React.FC = () => (
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
          Privacy Policy
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          <strong>Last Updated:</strong> March 29, 2025
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          RoofGrid UK ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our web-based roofing calculator application.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          1. Information We Collect
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          We collect the following types of information:
          <ul>
            <li>
              <strong>Personal Information:</strong> When you register, we collect your username, email address, and password.
            </li>
            <li>
              <strong>Geolocation Data:</strong> If you allow it, we may access your location to provide weather data in the Weather Widget. This requires your explicit consent via your browser.
            </li>
            <li>
              <strong>Location Input Data:</strong> You may enter a UK postcode, town, or city to fetch weather data. Postcodes are converted to coordinates using the Postcodes.io API, and town/city names are converted to coordinates using the OpenWeatherMap Geocoding API.
            </li>
            <li>
              <strong>Calculator Data (Pro Users):</strong> For Pro users, we store custom tiles and project data (e.g., tile dimensions, roof measurements, project names) in our database.
            </li>
            <li>
              <strong>Local Storage:</strong> We use local storage to cache weather data (including location, temperature, and forecast) for up to 1 hour to improve performance. You can clear this cache at any time using the "Clear Weather Cache" button in the Weather Widget.
            </li>
          </ul>
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          2. How We Use Your Information
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          We use your information to:
          <ul>
            <li>Provide and improve our services (e.g., roofing calculations, project management for Pro users, weather forecasts).</li>
            <li>Authenticate users and manage accounts.</li>
            <li>Provide weather data based on your location, postcode, or town/city (if provided).</li>
          </ul>
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          3. Cookies and Similar Technologies
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          We use essential cookies to maintain your login session. We also use local storage to cache weather data for performance purposes. This data is stored on your device for up to 1 hour. We do not use non-essential cookies (e.g., for analytics or advertising).
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          4. Legal Basis for Processing
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          We process your data under the following legal bases:
          <ul>
            <li>
              <strong>Contractual Necessity:</strong> To provide the service (e.g., user account creation, saving projects for Pro users).
            </li>
            <li>
              <strong>Consent:</strong> For geolocation data (via browser prompt).
            </li>
            <li>
              <strong>Legitimate Interest:</strong> For essential cookies and local storage to ensure the app functions efficiently.
            </li>
          </ul>
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          5. Data Sharing
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          We share your data with:
          <ul>
            <li>
              <strong>OpenWeatherMap:</strong> To fetch weather data based on your location, postcode, or town/city.
            </li>
            <li>
              <strong>Postcodes.io:</strong> To convert UK postcodes to coordinates for weather data.
            </li>
          </ul>
          We do not share your data for marketing or advertising purposes.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          6. Data Retention
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          <ul>
            <li>
              <strong>User Data:</strong> Retained until you delete your account.
            </li>
            <li>
              <strong>Weather Cache:</strong> Stored in local storage for up to 1 hour.
            </li>
          </ul>
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          7. Your Rights
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          Under the UK GDPR, you have the right to:
          <ul>
            <li>Access, correct, or delete your personal data (via the Profile page).</li>
            <li>Withdraw consent for geolocation data at any time via your browser settings.</li>
            <li>Request a copy of your data or restrict its processing.</li>
          </ul>
          To exercise these rights, please contact us at privacy@roofgriduk.com.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          8. Security
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          We use secure methods to protect your data, including HTTPS for data transmission, password hashing, and secure authentication.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          9. Contact Us
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          If you have any questions about this Privacy Policy, please contact us at privacy@roofgriduk.com.
        </Typography>
      </Container>
    </Box>
    <Footer />
  </Box>
);

export default PrivacyPolicy;