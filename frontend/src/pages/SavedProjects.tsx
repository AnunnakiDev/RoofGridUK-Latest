import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import api from '../services/api';
import { useUser } from '../context/UserContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Project {
  id: number;
  projectName: string;
  createdAt: string;
  rafterHeights: number[];
  widths: number[];
  settings: {
    useDryRidge: 'YES' | 'NO';
    leftVergeType: 'Wet' | 'Dry' | 'Abutment';
    rightVergeType: 'Wet' | 'Dry' | 'Abutment';
    useLHTile: 'YES' | 'NO';
    lhTileWidth: number;
    gutterOverhang: number;
  };
  verticalResults: any; // Replace with proper type from calculateVertical
  horizontalResults: any; // Replace with proper type from calculateHorizontal
  totalResults: {
    totalCourses: number;
    totalTiles: number;
    halfTiles: number;
  } | null;
}

const SavedProjects: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch saved projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user.id) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await api.get('/api/projects');
        setProjects(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch saved projects. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user.id, navigate]);

  // Handle project deletion
  const handleDelete = async (projectId: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/api/projects/${projectId}`);
        setProjects(projects.filter((project) => project.id !== projectId));
        setError(null);
      } catch (err) {
        setError('Failed to delete project. Please try again.');
      }
    }
  };

  // Handle project edit (navigate to Calculator with pre-filled data)
  const handleEdit = (project: Project) => {
    // Navigate to Calculator with project data
    navigate('/calculator', { state: { project } });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box
        sx={{
          flexGrow: 1,
          maxWidth: 900,
          mx: 'auto',
          p: { xs: 2, sm: 3 },
          pt: { xs: '64px', md: '80px' },
          pb: { xs: '120px', md: '140px' },
          minHeight: 'calc(100vh - 128px)',
        }}
      >
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Saved Projects
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {projects.length === 0 ? (
          <Typography variant="body1" align="center" sx={{ color: 'text.secondary', fontSize: { xs: '1rem', sm: '1.2rem' } }}>
            No saved projects found. Start by saving a project from the Calculator.
          </Typography>
        ) : (
          <Paper sx={{ borderRadius: 2, boxShadow: 2, overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', sm: '1.1rem' } }}>Project Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', sm: '1.1rem' } }}>Date Saved</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', sm: '1.1rem' } }}>Total Tiles</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', sm: '1.1rem' } }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>{project.projectName}</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                      {new Date(project.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                      {project.totalResults ? project.totalResults.totalTiles : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit Project">
                        <IconButton onClick={() => handleEdit(project)} color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Project">
                        <IconButton onClick={() => handleDelete(project.id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>
      <Footer />
    </Box>
  );
};

export default SavedProjects;