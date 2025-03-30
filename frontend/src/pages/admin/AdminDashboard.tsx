import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

// Import icons from Material-UI
import TilesIcon from '@mui/icons-material/Dashboard'; // For Total Default Tiles
import PeopleIcon from '@mui/icons-material/People'; // For Total Users
import CustomTilesIcon from '@mui/icons-material/Extension'; // For Total Custom Tiles
import ProjectsIcon from '@mui/icons-material/Folder'; // For Total Saved Projects

interface Stats {
  tileCount: number;
  userCount: number;
  customTileCount: number;
  projectCount: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({ tileCount: 0, userCount: 0, customTileCount: 0, projectCount: 0 });
  const [error, setError] = useState<string | null>(null);

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

  // Navigation handlers for each card
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Admin Dashboard
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* System Statistics Section */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'medium', color: '#1b75bc' }}>
        System Statistics
      </Typography>

      <Grid container spacing={2}>
        {/* Total Default Tiles Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              bgcolor: '#ffffff',
              boxShadow: 1,
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: 3,
                transform: 'scale(1.02)',
                cursor: 'pointer',
              },
            }}
            onClick={() => handleNavigate('/admin/tile-management')}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <TilesIcon sx={{ fontSize: 40, color: '#1b75bc', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.tileCount}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                Total Default Tiles
              </Typography>
              <Link
                component="button"
                underline="hover"
                sx={{ color: '#1b75bc', fontSize: '0.9rem' }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click from triggering
                  handleNavigate('/admin/tile-management');
                }}
              >
                View Details
              </Link>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Users Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              bgcolor: '#ffffff',
              boxShadow: 1,
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: 3,
                transform: 'scale(1.02)',
                cursor: 'pointer',
              },
            }}
            onClick={() => handleNavigate('/admin/user-management')}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <PeopleIcon sx={{ fontSize: 40, color: '#1b75bc', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.userCount}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                Total Users
              </Typography>
              <Link
                component="button"
                underline="hover"
                sx={{ color: '#1b75bc', fontSize: '0.9rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigate('/admin/user-management');
                }}
              >
                View Details
              </Link>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Custom Tiles Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              bgcolor: '#ffffff',
              boxShadow: 1,
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: 3,
                transform: 'scale(1.02)',
                cursor: 'pointer',
              },
            }}
            onClick={() => handleNavigate('/admin/personal-tiles')}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CustomTilesIcon sx={{ fontSize: 40, color: '#1b75bc', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.customTileCount}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                Total Custom Tiles
              </Typography>
              <Link
                component="button"
                underline="hover"
                sx={{ color: '#1b75bc', fontSize: '0.9rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigate('/admin/personal-tiles');
                }}
              >
                View Details
              </Link>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Saved Projects Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              bgcolor: '#ffffff',
              boxShadow: 1,
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: 3,
                transform: 'scale(1.02)',
                cursor: 'pointer',
              },
            }}
            onClick={() => handleNavigate('/admin/projects')}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ProjectsIcon sx={{ fontSize: 40, color: '#1b75bc', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.projectCount}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                Total Saved Projects
              </Typography>
              <Link
                component="button"
                underline="hover"
                sx={{ color: '#1b75bc', fontSize: '0.9rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigate('/admin/projects');
                }}
              >
                View Details
              </Link>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;