import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile: React.FC = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ currentPassword?: string; newPassword?: string }>({});

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
    setFormErrors({});

    // Validate form
    const currentPasswordError = validatePassword(currentPassword);
    const newPasswordError = validatePassword(newPassword);
    if (currentPasswordError || newPasswordError) {
      setFormErrors({
        currentPassword: currentPasswordError,
        newPassword: newPasswordError,
      });
      return;
    }

    try {
      const response = await api.post('/api/auth/change-password', { currentPassword, newPassword });
      setSuccess(response.data.message);
      setCurrentPassword('');
      setNewPassword('');
      // Log the user out after a short delay to allow them to see the success message
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password');
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
          pt: { xs: '80px', sm: '100px' }, // Account for fixed Navbar
        }}
      >
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#1b75bc' }}>
          Profile
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2, width: '100%', maxWidth: 400 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2, width: '100%', maxWidth: 400 }}>{success}</Alert>}
        <Box sx={{ width: '100%', maxWidth: 400, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1b75bc' }}>
            Account Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                value={user.email || ''}
                fullWidth
                disabled
                variant="outlined"
                InputLabelProps={{ style: { color: '#1b75bc' } }}
                sx={{ bgcolor: '#f5f5f5' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Role"
                value={user.role || ''}
                fullWidth
                disabled
                variant="outlined"
                InputLabelProps={{ style: { color: '#1b75bc' } }}
                sx={{ bgcolor: '#f5f5f5' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Subscription"
                value={user.subscription || ''}
                fullWidth
                disabled
                variant="outlined"
                InputLabelProps={{ style: { color: '#1b75bc' } }}
                sx={{ bgcolor: '#f5f5f5' }}
              />
            </Grid>
          </Grid>
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: '100%', maxWidth: 400 }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1b75bc' }}>
            Change Password
          </Typography>
          <TextField
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              setFormErrors((prev) => ({ ...prev, currentPassword: undefined }));
            }}
            fullWidth
            margin="normal"
            required
            error={!!formErrors.currentPassword}
            helperText={formErrors.currentPassword}
            InputLabelProps={{ style: { color: '#1b75bc' } }}
            sx={{ bgcolor: '#f5f5f5' }}
          />
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
            InputLabelProps={{ style: { color: '#1b75bc' } }}
            sx={{ bgcolor: '#f5f5f5' }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, py: 1.5, fontSize: '1rem', bgcolor: '#1b75bc' }}
          >
            Change Password
          </Button>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Profile;