import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Link, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '../context/UserContext';
import api from '../services/api';
import PageLayout from '../components/PageLayout';

interface JwtPayload {
  id: number;
  role: string;
  subscription: string;
  email: string;
}

const heroStyles = {
  width: '100%',
  height: { xs: '300px', md: '400px' },
  backgroundImage: 'url(/images/uk-pitched-roof.jpg)', // Placeholder roofing image
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  mb: 0, // Minimal space below hero to match homepage
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    bgcolor: 'rgba(0, 0, 0, 0.4)', // Dark overlay for text readability
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
  mt: 8, // Matches homepage for vertical centering
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

const Login: React.FC = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // State for "Remember Me"
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
      const response = await api.post('/api/auth/login', { email, password, rememberMe });
      const token = response.data.token;
      const decoded: JwtPayload = jwtDecode(token);

      // Store user data in context
      const userData = {
        id: decoded.id,
        token: token,
        role: decoded.role,
        subscription: decoded.subscription,
        email: decoded.email,
      };
      setUser(userData);

      // Store token and user data based on "Remember Me"
      if (rememberMe) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(userData));
      }

      // Redirect to the preserved path or default based on role
      const redirectPath = localStorage.getItem('redirectAfterLogin') || (decoded.role === 'admin' ? '/admin/profile' : '/calculator');
      localStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath);
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Hero Section */}
      <Box sx={heroStyles}>
        <Typography variant="h2" sx={titleStyles}>
          Log In to RoofGrid UK
        </Typography>
        <Typography variant="subtitle1" sx={subtitleStyles}>
          Access your roofing projects with ease
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
            onClick={() => navigate('/login')}
            sx={{ 
              bgcolor: '#1b75bc', 
              '&:hover': { bgcolor: '#145ea8' }, 
              minWidth: { xs: 160, md: 200 },
              py: 1,
            }}
          >
            Log In
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/register')}
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
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#1b75bc', textAlign: 'center' }}>
          Login
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2, width: '100%', maxWidth: 400, mx: 'auto' }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
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
          <FormControlLabel
            control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
            label="Remember Me"
            sx={{ mt: 1, mb: 2 }}
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
      </PageLayout>
    </Box>
  );
};

export default Login;