import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Card, CardContent, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ tileCount: 0, userCount: 0, customTileCount: 0, projectCount: 0 });
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/admin/stats');
        setStats(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch admin statistics');
      }
    };

    fetchStats();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/admin/projects');
        break;
      case 1:
        navigate('/admin/personal-tiles');
        break;
      case 2:
        navigate('/admin/tile-management');
        break;
      case 3:
        navigate('/admin/user-management');
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#1b75bc' }}>
        Admin Dashboard
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        centered
        sx={{
          mb: 4,
          bgcolor: '#f5f5f5',
          borderRadius: 1,
          '& .MuiTab-root': {
            fontSize: { xs: '0.9rem', sm: '1rem' },
            fontWeight: 'bold',
            color: '#1b75bc',
            textTransform: 'none',
            padding: { xs: '8px 16px', sm: '12px 24px' },
          },
          '& .Mui-selected': {
            color: '#ffffff',
            bgcolor: '#1b75bc',
            borderRadius: 1,
          },
          '& .MuiTabs-indicator': {
            display: 'none',
          },
        }}
      >
        <Tab label="Saved Projects" />
        <Tab label="Personal Tiles" />
        <Tab label="Tile Management" />
        <Tab label="User Management" />
      </Tabs>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#1b75bc' }}>
        System Statistics
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#f5f5f5' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b75bc' }}>
                Total Default Tiles
              </Typography>
              <Typography variant="h4">{stats.tileCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#f5f5f5' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b75bc' }}>
                Total Users
              </Typography>
              <Typography variant="h4">{stats.userCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#f5f5f5' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b75bc' }}>
                Total Custom Tiles
              </Typography>
              <Typography variant="h4">{stats.customTileCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#f5f5f5' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b75bc' }}>
                Total Saved Projects
              </Typography>
              <Typography variant="h4">{stats.projectCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;