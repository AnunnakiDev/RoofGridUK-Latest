// frontend/src/pages/Contact.tsx
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Fade, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import PageLayout from '../components/PageLayout';
import api from '../services/api';
import { useUser } from '../context/UserContext';

const Contact: React.FC = () => {
  const { user } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const subjects = [
    'General Enquiry',
    'Technical Support',
    'Account Management',
    'Tile Management',
    'Project Management',
    'Upgrade / Downgrade Enquiries',
    'Feedback',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      setStatus('error');
      setStatusMessage('Please fill out all fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setStatusMessage('Please enter a valid email address.');
      return;
    }

    const formData = {
      name,
      email,
      subject,
      message,
      subscription: user?.subscription || 'Free',
    };

    try {
      await api.post('/api/contact', formData);
      setStatus('success');
      setStatusMessage('Your message has been sent! We’ll get back to you soon.');
      setName('');
      setEmail(user?.email || '');
      setSubject('');
      setMessage('');
    } catch (error) {
      setStatus('error');
      setStatusMessage('Failed to send your message. Please try again later.');
    }
  };

  const handleScrollToForm = () => {
    const formSection = document.getElementById('contact-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const heroStyles = {
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
    mb: 0,
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      bgcolor: 'rgba(0, 0, 0, 0.4)',
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
    mt: 8,
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Hero Section */}
      <Box sx={heroStyles}>
        <Typography variant="h2" sx={titleStyles}>
          Get in Touch
        </Typography>
        <Typography variant="subtitle1" sx={subtitleStyles}>
          We’re here to help with any questions or support
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
            onClick={handleScrollToForm}
            sx={{ 
              bgcolor: '#1b75bc', 
              '&:hover': { bgcolor: '#145ea8' }, 
              minWidth: { xs: 160, md: 200 },
              py: 1,
            }}
          >
            Send a Message
          </Button>
          <Button
            variant="outlined"
            size="large"
            href="/register"
            sx={{ 
              color: 'white', 
              borderColor: 'white', 
              '&:hover': { borderColor: '#f5f5f5', color: '#f5f5f5' }, 
              minWidth: { xs: 160, md: 200 },
              py: 1,
            }}
          >
            Sign Up Free
          </Button>
        </Box>
      </Box>

      {/* Content wrapped in PageLayout */}
      <PageLayout>
        <Fade in timeout={500}>
          <Grid container spacing={4} sx={{ alignItems: 'flex-start' }} id="contact-form">
            {/* Contact Form */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1b75bc' }}>
                  Send Us a Message
                </Typography>
                {status === 'success' && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {statusMessage}
                  </Alert>
                )}
                {status === 'error' && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {statusMessage}
                  </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                  />
                  <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    type="email"
                  />
                  <FormControl fullWidth margin="normal" required>
                    <InputLabel>Subject</InputLabel>
                    <Select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      label="Subject"
                    >
                      {subjects.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    multiline
                    rows={4}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2, py: 1.5, bgcolor: '#1b75bc', '&:hover': { bgcolor: '#145ea8' } }}
                  >
                    Send Message
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* Contact Details */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1b75bc' }}>
                  Contact Details
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Have a question or need support? Reach out to us directly:
                </Typography>
                <Typography variant="h6" sx={{ color: '#1b75bc', mt: 2 }}>
                  Email:{' '}
                  <a href="mailto:support@roofgrid.uk" style={{ color: '#1b75bc', textDecoration: 'underline' }}>
                    support@roofgrid.uk
                  </a>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Our team is here to assist with any inquiries about RoofGrid UK.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Fade>
      </PageLayout>
    </Box>
  );
};

export default Contact;