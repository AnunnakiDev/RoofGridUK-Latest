import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Alert, Link, Table, TableBody, TableCell, TableHead, TableRow, Grid } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '../context/UserContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface JwtPayload {
  id: number;
  role: string;
  subscription: string;
  email: string;
}

const comparisonData = [
  { feature: 'Calculator', free: 'Yes', pro: 'Yes', freeDesc: 'Basic calculations', proDesc: 'Advanced calculations' },
  { feature: 'Full Tile Library Access', free: 'No', pro: 'Yes', freeDesc: 'Limited options', proDesc: 'Access all tiles' },
  { feature: 'Manual Input', free: 'Yes', pro: 'Yes', freeDesc: 'Basic inputs', proDesc: 'Custom inputs' },
  { feature: 'Save Custom Tiles', free: 'No', pro: 'Yes', freeDesc: 'Not available', proDesc: 'Save your tiles' },
  { feature: 'Saved Projects', free: 'No', pro: 'Yes', freeDesc: 'Not available', proDesc: 'Store projects' },
  { feature: 'Professional Reports', free: 'No', pro: 'Yes', freeDesc: 'Not available', proDesc: 'Detailed reports' },
  { feature: 'Weather Integration', free: 'Yes', pro: 'Yes', freeDesc: 'Basic weather', proDesc: 'Enhanced weather' },
  { feature: 'Priority Support', free: 'No', pro: 'Yes', freeDesc: 'Standard support', proDesc: '24-hour priority' },
  { feature: 'No Ads', free: 'No', pro: 'Yes', freeDesc: 'Ads included', proDesc: 'Ad-free experience' },
];

const Register: React.FC = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});

  const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Invalid email format';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password) return 'Password is required';
    if (!passwordRegex.test(password)) {
      return 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }
    return undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFormErrors({});

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (emailError || passwordError) {
      setFormErrors({ email: emailError, password: passwordError });
      return;
    }

    try {
      const response = await api.post('/api/auth/register', { email, password });
      const token = response.data.token;
      const decoded: JwtPayload = jwtDecode(token);
      setUser({
        id: decoded.id,
        token: token,
        role: decoded.role,
        subscription: decoded.subscription,
        email: decoded.email,
      });
      navigate('/calculator');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

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
            Join RoofGrid UK
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: 'white', mt: 1, zIndex: 1, textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)', textAlign: 'center' }}
          >
            Register for Free or Unlock Pro Features
          </Typography>
        </Box>

        {/* Content Section - More Width Padding on Small Screens */}
        <Container
          maxWidth="lg"
          sx={{
            py: 6,
            px: { xs: 4, md: 0 }, // Added horizontal padding on smaller screens
          }}
        >
          <Grid container spacing={4} sx={{ alignItems: 'flex-start' }}>
            {/* Registration Form */}
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1b75bc' }}>
                  Sign up today!
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setFormErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    fullWidth
                    margin="normal"
                    required
                    type="email"
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setFormErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    fullWidth
                    margin="normal"
                    required
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2, py: 1.5, bgcolor: '#1b75bc', '&:hover': { bgcolor: '#145ea8' } }}
                  >
                    Register Now
                  </Button>
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2">
                      Already have an account?{' '}
                      <Link component={RouterLink} to="/login" sx={{ color: '#1b75bc', textDecoration: 'underline' }}>
                        Login
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Free vs Pro Comparison Table */}
            <Grid item xs={12} md={7}>
              <Box
                sx={{
                  bgcolor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: 2,
                  p: 3,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1b75bc', mb: 2 }}>
                  Free vs. Pro Comparison
                </Typography>
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
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;