import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Link, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Change to named import
import { useUser } from '../context/UserContext';
import api from '../services/api';

interface JwtPayload {
  id: number;
  role: string;
  subscription: string;
  email: string;
}

const Login: React.FC = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openForgotPasswordDialog, setOpenForgotPasswordDialog] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState<string | null>(null);

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
        role: decoded.role,
        subscription: decoded.subscription,
        email: decoded.email,
      });
      if (decoded.role === 'admin') {
        navigate('/admin/projects');
      } else {
        navigate('/calculator');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleForgotPasswordOpen = () => {
    setOpenForgotPasswordDialog(true);
    setForgotEmail('');
    setForgotError(null);
    setSuccess(null);
  };

  const handleForgotPasswordClose = () => {
    setOpenForgotPasswordDialog(false);
    setForgotEmail('');
    setForgotError(null);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setSuccess(null);
    try {
      const response = await api.post('/api/auth/forgot-password', { email: forgotEmail });
      setSuccess(response.data.message);
      setForgotEmail('');
    } catch (err: any) {
      setForgotError(err.response?.data?.message || 'Failed to send password reset email');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#1b75bc' }}>
        Login
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 400 }}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
          required
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
          sx={{ mt: 2, py: 1.5, fontSize: '1rem' }}
        >
          Login
        </Button>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link
            component="button"
            variant="body2"
            onClick={handleForgotPasswordOpen}
            sx={{ color: '#1b75bc', textDecoration: 'underline' }}
          >
            Forgot Password?
          </Link>
        </Box>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link href="/register" sx={{ color: '#1b75bc', textDecoration: 'underline' }}>
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>

      {/* Forgot Password Dialog */}
      <Dialog open={openForgotPasswordDialog} onClose={handleForgotPasswordClose} maxWidth="sm" fullWidth>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          {forgotError && <Alert severity="error" sx={{ mb: 2 }}>{forgotError}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <Typography sx={{ mb: 2 }}>
            Enter your email address below, and we'll send you a link to reset your password.
          </Typography>
          <Box component="form" onSubmit={handleForgotPasswordSubmit}>
            <TextField
              label="Email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
              type="email"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleForgotPasswordClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleForgotPasswordSubmit} color="primary">
            Send Reset Link
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;