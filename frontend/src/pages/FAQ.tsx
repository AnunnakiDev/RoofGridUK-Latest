import React from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, Fade, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useUser } from '../context/UserContext';

const faqs = [
  {
    question: 'What is RoofGrid UK?',
    answer: 'RoofGrid UK is a precision roofing calculation tool designed for professionals. It helps you calculate tiles, battens, and more, ensuring compliance with UK standards like BS 5534.',
  },
  {
    question: 'How do I get started?',
    answer: 'Sign up for a free account on the Register page, then head to the Calculator to start your first project. No installation required—just your browser!',
  },
  {
    question: 'What’s the difference between Free and Pro?',
    answer: 'The Free plan includes basic calculator access, manual input, and weather integration with ads. The Pro plan adds full tile library access, saved projects, custom tiles, professional reports, priority support, and an ad-free experience.',
  },
  {
    question: 'Can I use RoofGrid UK offline?',
    answer: 'Yes, RoofGrid UK offers offline capabilities for core features like the calculator, ideal for rural sites. Some features, like weather updates and project saving, require an internet connection.',
  },
  {
    question: 'How do I contact support?',
    answer: 'Visit our Contact page to send us a message, or email us directly at support@roofgrid.uk. Pro users receive priority support with faster response times.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We adhere to strict privacy policies to protect your personal and project data. See our Privacy Policy for details.',
  },
  {
    question: 'How do I upgrade to Pro?',
    answer: 'Log in, go to your Profile page, and follow the upgrade instructions to unlock Pro features with a subscription.',
  },
];

const FAQ: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const getButtonProps = () => {
    if (!user) {
      return { text: 'Sign Up Now', path: '/register' };
    }
    if (user.subscription === 'Free') {
      return { text: 'Upgrade to Pro', path: '/profile' };
    }
    return { text: 'Priority Support', path: '/contact' }; // Pro users
  };

  const { text, path } = getButtonProps();

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
            Frequently Asked Questions
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
            Find answers to common questions about RoofGrid UK
          </Typography>
        </Box>

        {/* FAQ Section - More Width Padding on Small Screens */}
        <Container maxWidth="md" sx={{ py: 6, px: { xs: 4, md: 0 } }}>
          <Fade in timeout={500}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {faqs.map((faq, index) => (
                <Accordion key={index} sx={{ bgcolor: 'white', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#1b75bc' }} />}>
                    <Typography variant="h6" sx={{ color: '#1b75bc', fontWeight: 'bold' }}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" color="text.secondary">
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
              <Box sx={{ mt: 6, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate(path)}
                  sx={{ bgcolor: '#1b75bc', '&:hover': { bgcolor: '#145ea8' }, minWidth: { xs: 200, md: 240 }, py: 1.5 }}
                >
                  {text}
                </Button>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default FAQ;