import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Link, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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

const Login: React.FC = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openForgotPasswordDialog, setOpenForgotPasswordDialog] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});

  const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Invalid email format';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    return undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRemainingAttempts(null);
    setFormErrors({});

    // Validate form
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (emailError || passwordError) {
      setFormErrors({
        email: emailError,
        password: passwordError,
      });
      return;
    }

    try {
      const response = await api.post('/api/auth/login', { email, password });
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
      const remaining = err.response?.headers['ratelimit-remaining'];
      if (remaining !== undefined) {
        const remainingAttempts = parseInt(remaining, 10);
        setRemainingAttempts(remainingAttempts);
      }

      if (err.response?.status === 429) {
        setError('Too many login attempts. Please try again after 15 minutes.');
      } else {
        const baseError = err.response?.data?.message || 'Login failed';
        if (remaining !== undefined && remaining > 0) {
          setError(`${baseError}. You have ${remaining} attempt${remaining === 1 ? '' : 's'} remaining before a 15-minute lockout.`);
        } else {
          setError(baseError);
        }
      }
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

    const emailError = validateEmail(forgotEmail);
    if (emailError) {
      setForgotError(emailError);
      return;
    }

    try {
      const response = await api.post('/api/auth/forgot-password', { email: forgotEmail });
      setSuccess(response.data.message);
      setForgotEmail('');
    } catch (err: any) {
      if (err.response?.status === 429) {
        setForgotError('Too many password reset attempts. Please try again after 15 minutes.');
      } else {
        setForgotError(err.response?.data?.message || 'Failed to send password reset email');
      }
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
          Login
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2, width: '100%', maxWidth: 400 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 400 }}>
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
            color="primary"
            fullWidth
            sx={{ mt: 2, py: 1.5, fontSize: '1rem', bgcolor: '#1b75bc' }}
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
                onChange={(e) => {
                  setForgotEmail(e.target.value);
                  setForgotError(null);
                }}
                fullWidth
                margin="normal"
                required
                type="email"
                error={!!forgotError && forgotError.includes('email')}
                helperText={forgotError && forgotError.includes('email') ? forgotError : undefined}
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
      <Footer />
    </Box>
  );
};

export default Login;