import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Change to named import
import api from '../services/api';

interface JwtPayload {
  userId: number;
}

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ newPassword?: string }>({});

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setError('Invalid or missing token. Please request a new password reset link.');
    } else {
      try {
        jwtDecode<JwtPayload>(tokenParam); // Validate token format
        setToken(tokenParam);
      } catch (err) {
        setError('Invalid token. Please request a new password reset link.');
      }
    }
  }, [searchParams]);

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
    setSuccess(null);

    // Validate password
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setFormErrors({ newPassword: passwordError });
      return;
    }

    if (!token) {
      setError('Invalid or missing token. Please request a new password reset link.');
      return;
    }

    try {
      const response = await api.post('/api/auth/reset-password', { token, newPassword });
      setSuccess(response.data.message);
      setNewPassword('');
      setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
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
        Reset Password
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 400 }}>
        <TextField
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            setFormErrors((prev) => ({ ...prev, newPassword: undefined }));
          }}
          fullWidth
          margin="normal"
          required
          error={!!formErrors.newPassword}
          helperText={formErrors.newPassword}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2, py: 1.5, fontSize: '1rem' }}
        >
          Reset Password
        </Button>
      </Box>
    </Box>
  );
};

export default ResetPassword;