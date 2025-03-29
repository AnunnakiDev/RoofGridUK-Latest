import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Card, CardContent, Grid } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import api from '../../services/api';

interface AdminStats {
  tileCount: number;
  userCount: number;
}

const AdminDashboard: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats>({ tileCount: 0, userCount: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user.id) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/profile');
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await api.get('/api/admin/stats');
        setStats(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch admin statistics');
      }
    };

    fetchStats();
  }, [user.id, user.role, navigate]);

  const navItems = [
    { label: 'Saved Projects', path: '/admin/projects' },
    ...(user.subscription === 'pro' ? [{ label: 'Personal Tiles', path: '/admin/personal-tiles' }] : []),
    { label: 'Tile Management', path: '/admin/tile-management' },
    { label: 'User Management', path: '/admin/user-management' },
  ];

  return (
    <>
      <Typography
        variant="h4"
        align="center"
        sx={{ fontWeight: 'bold', mb: 2, color: '#1b75bc', fontSize: { xs: '1.5rem', sm: '2rem' } }}
      >
        Admin Dashboard
      </Typography>
      <Typography
        align="center"
        sx={{ mb: 4, color: 'text.secondary', fontSize: { xs: '0.9rem', sm: '1rem' }, px: 2 }}
      >
        Welcome back {user.email}, manage default tiles, users, and your saved projects and personal tiles.
      </Typography>

      {/* Navigation Menu */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on mobile
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          px: { xs: 1, sm: 0 }, // Add padding on mobile
        }}
      >
        {navItems.map((item) => (
          <Button
            key={item.label}
            component={Link}
            to={item.path}
            variant="contained"
            sx={{
              bgcolor: '#1b75bc',
              color: 'white',
              fontWeight: 'bold',
              textTransform: 'none',
              fontSize: { xs: '0.9rem', sm: '1rem' }, // Smaller font on mobile
              px: { xs: 2, sm: 3 },
              py: 1,
              borderRadius: '8px',
              width: { xs: '100%', sm: 'auto' }, // Full width on mobile
              maxWidth: { xs: '300px', sm: 'none' }, // Limit width on mobile
              '&:hover': {
                bgcolor: '#1565c0',
              },
            }}
          >
            {item.label}
          </Button>
        ))}
      </Box>

      {/* Statistics Section */}
      {error && (
        <Typography align="center" color="error" sx={{ mb: 2, px: 2 }}>
          {error}
        </Typography>
      )}
      <Box sx={{ maxWidth: 800, mx: 'auto', px: { xs: 1, sm: 0 } }}>
        <Typography
          variant="h5"
          align="center"
          sx={{ fontWeight: 'bold', mb: 3, color: '#1b75bc', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
        >
          System Statistics
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Card sx={{ bgcolor: '#f5f5f5', borderRadius: '8px' }}>
              <CardContent>
                <Typography
                  variant="h6"
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1b75bc', fontSize: { xs: '1rem', sm: '1.25rem' } }}
                >
                  Total Tiles
                </Typography>
                <Typography
                  variant="h4"
                  align="center"
                  sx={{ mt: 1, color: 'text.primary', fontSize: { xs: '1.5rem', sm: '2rem' } }}
                >
                  {stats.tileCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ bgcolor: '#f5f5f5', borderRadius: '8px' }}>
              <CardContent>
                <Typography
                  variant="h6"
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1b75bc', fontSize: { xs: '1rem', sm: '1.25rem' } }}
                >
                  Total Users
                </Typography>
                <Typography
                  variant="h4"
                  align="center"
                  sx={{ mt: 1, color: 'text.primary', fontSize: { xs: '1.5rem', sm: '2rem' } }}
                >
                  {stats.userCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AdminDashboard;