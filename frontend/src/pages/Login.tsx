import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
import { useUser } from '../context/UserContext';
import Navbar from '../components/Navbar'; // Import Navbar
import Footer from '../components/Footer'; // Import Footer

interface JwtPayload {
  id: number;
  username: string;
  role: string;
  subscription: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await api.post('/api/auth/login', { username, password });
      const token = response.data.token;
      const decoded: JwtPayload = jwtDecode(token);
      setUser({
        id: decoded.id,
        token: token,
        role: response.data.role,
        subscription: response.data.subscription,
      });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box sx={{ flexGrow: 1, maxWidth: 400, mx: 'auto', mt: 4, p: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1b75bc' }}>
          Login
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            required
            variant="outlined"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            variant="outlined"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, py: 1.5, fontSize: '1.2rem' }}>
            Login
          </Button>
        </form>
        <Typography align="center" sx={{ mt: 2 }}>
          Don't have an account?{' '}
          <Button color="primary" onClick={() => navigate('/register')}>
            Register
          </Button>
        </Typography>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;