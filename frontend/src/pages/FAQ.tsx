import React from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FAQ: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      {/* Full-width Header Image */}
      <Box
        sx={{
          width: '100%',
          height: { xs: '200px', md: '300px' },
          backgroundImage: 'url(/images/uk-pitched-roof.jpg)', // Placeholder
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.3)', // Subtle overlay
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
          }}
        >
          Frequently Asked Questions
        </Typography>
      </Box>

      {/* FAQ Section */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 }, flexGrow: 1 }}>
        <Box sx={{ maxWidth: 800, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* General Questions */}
          <Accordion sx={{ bgcolor: 'rgba(27, 117, 188, 0.7)', borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
              <Typography
                variant="h5"
                sx={{ color: 'white', fontSize: 20, textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' }}
              >
                What is RoofGrid UK?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                sx={{ color: 'white', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)', mb: 2 }}
              >
                RoofGrid UK is a web-based tool designed for roofing professionals and DIY enthusiasts to calculate roofing materials, manage projects, and streamline workflows. It offers free basic features and premium Pro options.
              </Typography>
              <Button variant="outlined" color="inherit" href="/app-benefits" sx={{ color: 'white', borderColor: 'white' }}>
                Learn More
              </Button>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ bgcolor: 'rgba(27, 117, 188, 0.7)', borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
              <Typography
                variant="h5"
                sx={{ color: 'white', fontSize: 20, textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' }}
              >
                Do I need an account to use RoofGrid UK?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                sx={{ color: 'white', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)', mb: 2 }}
              >
                No, you can use the basic calculator without an account. However, creating an account lets you save projects, custom tiles, and access Pro features.
              </Typography>
              <Button variant="outlined" color="inherit" href="/register" sx={{ color: 'white', borderColor: 'white' }}>
                Sign Up
              </Button>
            </AccordionDetails>
          </Accordion>

          {/* Usage Questions */}
          <Accordion sx={{ bgcolor: 'rgba(27, 117, 188, 0.7)', borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
              <Typography
                variant="h5"
                sx={{ color: 'white', fontSize: 20, textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' }}
              >
                How do I calculate roofing materials?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                sx={{ color: 'white', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)', mb: 2 }}
              >
                Go to the Calculator page, input your tile type, roof dimensions, and settings (e.g., ridge type), then click "Calculate Roof" to get detailed results like tile count and batten spacing.
              </Typography>
              <Button variant="outlined" color="inherit" href="/calculator" sx={{ color: 'white', borderColor: 'white' }}>
                Try Calculator
              </Button>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ bgcolor: 'rgba(27, 117, 188, 0.7)', borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
              <Typography
                variant="h5"
                sx={{ color: 'white', fontSize: 20, textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' }}
              >
                Can I save my projects?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                sx={{ color: 'white', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)', mb: 2 }}
              >
                Yes, with a Pro account, you can save projects and custom tiles. After calculating, name your project and click "Save Results" to store it in your profile.
              </Typography>
              <Button variant="outlined" color="inherit" href="/how-to-use" sx={{ color: 'white', borderColor: 'white' }}>
                See How
              </Button>
            </AccordionDetails>
          </Accordion>

          {/* Features Questions */}
          <Accordion sx={{ bgcolor: 'rgba(27, 117, 188, 0.7)', borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
              <Typography
                variant="h5"
                sx={{ color: 'white', fontSize: 20, textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' }}
              >
                What are the Pro features?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                sx={{ color: 'white', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)', mb: 2 }}
              >
                Pro features include saving projects, custom tile libraries, cross-bonding options, and weather integration for better planning.
              </Typography>
              <Button variant="outlined" color="inherit" href="/pro-tips" sx={{ color: 'white', borderColor: 'white' }}>
                Pro Tips
              </Button>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ bgcolor: 'rgba(27, 117, 188, 0.7)', borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
              <Typography
                variant="h5"
                sx={{ color: 'white', fontSize: 20, textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' }}
              >
                Is RoofGrid UK mobile-friendly?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                sx={{ color: 'white', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)', mb: 2 }}
              >
                Yes, the app is fully responsive and optimized for use on smartphones and tablets, making it ideal for on-site calculations.
              </Typography>
              <Button variant="outlined" color="inherit" href="/app-benefits" sx={{ color: 'white', borderColor: 'white' }}>
                Benefits
              </Button>
            </AccordionDetails>
          </Accordion>

          {/* Pricing Questions */}
          <Accordion sx={{ bgcolor: 'rgba(27, 117, 188, 0.7)', borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
              <Typography
                variant="h5"
                sx={{ color: 'white', fontSize: 20, textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' }}
              >
                How much does RoofGrid UK cost?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                sx={{ color: 'white', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)', mb: 2 }}
              >
                The basic version is free, including the calculator. The Pro subscription, which unlocks advanced features, is available for a monthly or annual fee—check your profile for current pricing.
              </Typography>
              <Button variant="outlined" color="inherit" href="/profile" sx={{ color: 'white', borderColor: 'white' }}>
                Pricing
              </Button>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ bgcolor: 'rgba(27, 117, 188, 0.7)', borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
              <Typography
                variant="h5"
                sx={{ color: 'white', fontSize: 20, textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' }}
              >
                Can I try Pro features for free?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                sx={{ color: 'white', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)', mb: 2 }}
              >
                Yes, we offer a 14-day free trial for Pro features when you sign up. No payment details are required upfront.
              </Typography>
              <Button variant="outlined" color="inherit" href="/register" sx={{ color: 'white', borderColor: 'white' }}>
                Start Trial
              </Button>
            </AccordionDetails>
          </Accordion>

          {/* Technical/Support Questions */}
          <Accordion sx={{ bgcolor: 'rgba(27, 117, 188, 0.7)', borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
              <Typography
                variant="h5"
                sx={{ color: 'white', fontSize: 20, textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' }}
              >
                What browsers are supported?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                sx={{ color: 'white', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)', mb: 2 }}
              >
                RoofGrid UK works on the latest versions of Chrome, Firefox, Safari, and Edge. Ensure your browser is updated for the best experience.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ bgcolor: 'rgba(27, 117, 188, 0.7)', borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
              <Typography
                variant="h5"
                sx={{ color: 'white', fontSize: 20, textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' }}
              >
                How do I get support?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                sx={{ color: 'white', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)', mb: 2 }}
              >
                Visit our support page for FAQs, tutorials, or to submit a ticket. Pro users get priority email support within 24 hours.
              </Typography>
              <Button variant="outlined" color="inherit" href="/support" sx={{ color: 'white', borderColor: 'white' }}>
                Get Support
              </Button>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ bgcolor: 'rgba(27, 117, 188, 0.7)', borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
              <Typography
                variant="h5"
                sx={{ color: 'white', fontSize: 20, textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' }}
              >
                How accurate are the calculations?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                sx={{ color: 'white', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)', mb: 2 }}
              >
                Our calculations are based on UK roofing standards and manufacturer data, ensuring high accuracy. Always verify measurements on-site for precision.
              </Typography>
              <Button variant="outlined" color="inherit" href="/pro-tips" sx={{ color: 'white', borderColor: 'white' }}>
                Accuracy Tips
              </Button>
            </AccordionDetails>
          </Accordion>

          {/* Account Management */}
          <Accordion sx={{ bgcolor: 'rgba(27, 117, 188, 0.7)', borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
              <Typography
                variant="h5"
                sx={{ color: 'white', fontSize: 20, textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' }}
              >
                How do I cancel my Pro subscription?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                sx={{ color: 'white', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)', mb: 2 }}
              >
                You can cancel anytime in your profile settings under "Subscription." Your access continues until the billing cycle ends.
              </Typography>
              <Button variant="outlined" color="inherit" href="/profile" sx={{ color: 'white', borderColor: 'white' }}>
                Manage Account
              </Button>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ bgcolor: 'rgba(27, 117, 188, 0.7)', borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
              <Typography
                variant="h5"
                sx={{ color: 'white', fontSize: 20, textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' }}
              >
                What happens if I forget my password?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                sx={{ color: 'white', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)', mb: 2 }}
              >
                Click "Forgot Password" on the login page, enter your email, and follow the reset link sent to your inbox.
              </Typography>
              <Button variant="outlined" color="inherit" href="/login" sx={{ color: 'white', borderColor: 'white' }}>
                Reset Password
              </Button>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default FAQ;