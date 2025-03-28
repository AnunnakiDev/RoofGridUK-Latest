import React, { useState } from 'react';
import { Button, Box, Typography, Alert } from '@mui/material';
import api from '../services/api';
import { useUser } from '../context/UserContext';

const Subscribe: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user, setUser } = useUser();

  const handleSubscribe = async () => {
    console.log('User before subscription:', user); // Add debugging log
    if (!user.token) {
      setError('You must be logged in to subscribe.');
      return;
    }
    setError(null);
    setSuccess(null);
    try {
      const response = await api.post('/api/auth/subscribe', { userId: user.id });
      setUser({
        ...user,
        subscription: response.data.subscription,
      });
      console.log('User after subscription:', { ...user, subscription: response.data.subscription }); // Add debugging log
      setSuccess('Successfully upgraded to Pro!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Subscription failed');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Upgrade to Pro
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Typography variant="body1" gutterBottom>
        Upgrade to the Pro version to access project saving, tile library, and more!
      </Typography>
      <Button variant="contained" onClick={handleSubscribe} fullWidth>
        Subscribe (Mock Payment)
      </Button>
    </Box>
  );
};

export default Subscribe;