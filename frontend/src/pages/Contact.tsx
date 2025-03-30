import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Grid, Fade, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api'; // Assuming you have an API service
import { useUser } from '../context/UserContext'; // To access user subscription

const Contact: React.FC = () => {
  const { user } = useUser(); // Get user context for subscription type
  const [name, setName] = useState('');
  const [email, setEmail] = useState(user?.email || ''); // Pre-fill if logged in
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
    // Validation
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

    // Prepare data with subscription type (if user is logged in)
    const formData = {
      name,
      email,
      subject,
      message,
      subscription: user?.subscription || 'Free', // Include subscription type
    };

    try {
      // Replace with actual API call if available (e.g., to send email)
      await api.post('/api/contact', formData); // Placeholder endpoint
      setStatus('success');
      setStatusMessage('Your message has been sent! We’ll get back to you soon.');
      setName('');
      setEmail(user?.email || ''); // Reset to user's email if logged in
      setSubject('');
      setMessage('');
    } catch (error) {
      setStatus('error');
      setStatusMessage('Failed to send your message. Please try again later.');
    }
  };

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
            Get in Touch
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
            We’re here to help with any questions or support
          </Typography>
        </Box>

        {/* Contact Section */}
        <Container maxWidth="md" sx={{ py: 6, px: { xs: 4, md: 0 } }}>
          <Fade in timeout={500}>
            <Grid container spacing={4} sx={{ alignItems: 'flex-start' }}>
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
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Contact;