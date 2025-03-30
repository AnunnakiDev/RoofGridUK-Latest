import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // Import Link as RouterLink
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

const Register: React.FC = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Navbar />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 3 },
          pt: { xs: '80px', sm: '100px' },
        }}
      >
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#1b75bc' }}>
          Register
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2, width: '100%', maxWidth: 400 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 400 }}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
            type="email"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, py: 1.5, fontSize: '1rem', bgcolor: '#1b75bc' }}
          >
            Register
          </Button>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link
                component={RouterLink}
                to="/login"
                sx={{ color: '#1b75bc', textDecoration: 'underline' }}
              >
                Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;