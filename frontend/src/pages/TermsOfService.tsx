import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsOfService: React.FC = () => (
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
          Terms of Service
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          <strong>Last Updated:</strong> March 29, 2025
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          Welcome to RoofGrid UK ("we", "us", or "our"). These Terms of Service ("Terms") govern your use of our web-based roofing calculator application ("the App"). By accessing or using the App, you agree to be bound by these Terms. If you do not agree with these Terms, please do not use the App.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          1. Use of the App
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          The App is designed to assist roofing professionals and homeowners in planning and executing roofing projects by providing tools for calculating roofing measurements, estimating material requirements, and managing projects. You may use the App for lawful purposes only and in accordance with these Terms. You agree not to:
          <ul>
            <li>Use the App in any way that violates applicable laws or regulations.</li>
            <li>Attempt to gain unauthorized access to the App, its servers, or any associated systems.</li>
            <li>Interfere with or disrupt the App’s functionality, including by introducing viruses or other harmful code.</li>
            <li>Use the App to submit false, misleading, or inappropriate data (e.g., incorrect tile dimensions or roof measurements).</li>
          </ul>
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          2. Accounts and Subscriptions
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          To access certain features of the App (e.g., saving custom tiles, managing projects), you must register for an account. You agree to provide accurate and complete information during registration and to keep your account credentials secure. The App offers two user tiers:
          <ul>
            <li>
              <strong>Free Users:</strong> Can use the basic roofing calculator but cannot save custom tiles or projects.
            </li>
            <li>
              <strong>Pro Users:</strong> Have access to advanced features (e.g., saving custom tiles, managing projects) for a subscription fee.
            </li>
          </ul>
          Pro users are responsible for paying the subscription fee as outlined during registration. We reserve the right to change the subscription fee with prior notice.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          3. Refund Policy
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          We want you to be satisfied with your Pro subscription. If you are not satisfied, you may be eligible for a refund under the following conditions:
          <ul>
            <li>
              <strong>14-Day Cooling-Off Period:</strong> If you are a Pro user and have subscribed to the App, you have the right to cancel your subscription and request a full refund within 14 days of your initial subscription purchase ("Cooling-Off Period"). To be eligible, you must not have used the Pro features extensively (e.g., saving multiple custom tiles or projects) during this period.
            </li>
            <li>
              <strong>After the Cooling-Off Period:</strong> Refunds after the 14-day Cooling-Off Period are not available, except where required by law. If you cancel your subscription after this period, you will retain access to Pro features until the end of your current billing cycle, but no refund will be issued.
            </li>
            <li>
              <strong>Non-Refundable Situations:</strong> Refunds will not be provided if your account is terminated due to a violation of these Terms (e.g., misuse of the App, non-payment of subscription fees).
            </li>
            <li>
              <strong>How to Request a Refund:</strong> To request a refund, please contact us at privacy@roofgriduk.com within the 14-day Cooling-Off Period, providing your account details and subscription purchase date. We will process your refund within 14 days of receiving your request, using the original payment method.
            </li>
          </ul>
          If you have any questions about our Refund Policy, please contact us at privacy@roofgriduk.com.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          4. Intellectual Property
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          The App, including its design, code, and content (e.g., default tile library), is owned by RoofGrid UK and protected by intellectual property laws. You are granted a limited, non-exclusive, non-transferable license to use the App for personal or professional purposes. You may not copy, modify, distribute, or create derivative works of the App without our prior written consent. User-generated content (e.g., custom tiles, projects) remains your property, but you grant us a worldwide, royalty-free license to use, store, and display this content as necessary to provide the App’s services.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          5. Third-Party Services
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          The App integrates with third-party services, such as OpenWeatherMap (for weather data) and Postcodes.io (for postcode-to-coordinates conversion). Your use of these services is subject to their respective terms and conditions. We are not responsible for the availability, accuracy, or reliability of third-party services.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          6. Limitation of Liability
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          To the fullest extent permitted by law, RoofGrid UK shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the App, including but not limited to damages for loss of profits, data, or other intangible losses. This includes damages resulting from errors in calculations, reliance on weather data, or any other use of the App.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          7. Termination
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          We reserve the right to suspend or terminate your account and access to the App at our discretion, including for non-payment of subscription fees (for Pro users), violation of these Terms, or any unlawful activity. Upon termination, your data (e.g., custom tiles, projects) may be deleted, and you will no longer have access to Pro features.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          8. Changes to These Terms
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          We may update these Terms from time to time. If we make significant changes, we will notify you via email or through the App. Your continued use of the App after such changes constitutes your acceptance of the updated Terms.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          9. Governing Law
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          These Terms are governed by the laws of England and Wales. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4, mb: 2, color: '#1b75bc' }}>
          10. Contact Us
        </Typography>
        <Typography paragraph sx={{ color: 'text.secondary' }}>
          If you have any questions about these Terms of Service, please contact us at privacy@roofgriduk.com.
        </Typography>
      </Container>
    </Box>
    <Footer />
  </Box>
);

export default TermsOfService;