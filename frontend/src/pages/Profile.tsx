import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useUser } from '../context/UserContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
  subscription: string;
}

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
    materialType: string;
    slateTileHeight: number;
    tileCoverWidth: number;
    minGauge: number;
    maxGauge: number;
    minSpacing: number;
    maxSpacing: number;
    crossBonded: 'YES' | 'NO';
  };
  verticalResults: any;
  horizontalResults: any;
  totalResults: {
    totalCourses: number;
    totalTiles: number;
    halfTiles: number;
  } | null;
}

interface CustomTile {
  id: number;
  name: string;
  type: string;
  length: number;
  width: number;
  mingauge: number;
  maxgauge: number;
  minspacing: number;
  maxspacing: number;
  lhTileWidth: number;
  crossbonded: 'YES' | 'NO';
}

const Profile: React.FC = () => {
  const { user, setUser, logout } = useUser();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tiles, setTiles] = useState<CustomTile[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedTile, setSelectedTile] = useState<CustomTile | null>(null);
  const [expanded, setExpanded] = useState<number | false>(false);
  const [tileDataExpanded, setTileDataExpanded] = useState<number | false>(false);
  const [settingsExpanded, setSettingsExpanded] = useState<number | false>(false);

  useEffect(() => {
    if (!user.id) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/auth/profile');
        setProfile(response.data);
        setUsername(response.data.username);
        setEmail(response.data.email);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await api.get('/api/projects');
        setProjects(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch saved projects');
      }
    };

    const fetchTiles = async () => {
      try {
        const response = await api.get('/api/users/tiles');
        setTiles(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch custom tiles');
      }
    };

    fetchProfile();
    fetchProjects();
    if (user.subscription === 'pro') {
      fetchTiles();
    }
  }, [user.id, user.subscription, navigate]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await api.put('/api/auth/profile', { username, email });
      const token = response.data.token;
      setUser({
        id: user.id,
        token: token,
        role: user.role,
        subscription: user.subscription,
        email: email,
      });
      setSuccess('Profile updated successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await api.put('/api/auth/change-password', { currentPassword, newPassword });
      const token = response.data.token;
      setUser({
        id: user.id,
        token: token,
        role: user.role,
        subscription: user.subscription,
        email: user.email,
      });
      setSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  const handleProjectEdit = (project: Project) => {
    navigate('/calculator', { state: { project } });
  };

  const handleProjectDelete = async (projectId: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/api/projects/${projectId}`);
        setProjects(projects.filter((project) => project.id !== projectId));
        setSuccess('Project deleted successfully');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete project');
      }
    }
  };

  const handleTileEdit = (tile: CustomTile) => {
    setSelectedTile(tile);
    setOpen(true);
  };

  const handleTileDelete = async (tileId: number) => {
    if (window.confirm('Are you sure you want to delete this tile?')) {
      try {
        await api.delete(`/api/users/tiles/${tileId}`);
        setTiles(tiles.filter((tile) => tile.id !== tileId));
        setSuccess('Tile deleted successfully');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete tile');
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTile(null);
  };

  const handleTileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTile) return;

    try {
      const response = await api.put(`/api/users/tiles/${selectedTile.id}`, selectedTile);
      setTiles(tiles.map((tile) => (tile.id === selectedTile.id ? response.data : tile)));
      setSuccess('Tile updated successfully');
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update tile');
    }
  };

  const handleTileChange = (field: keyof CustomTile, value: any) => {
    if (selectedTile) {
      setSelectedTile({ ...selectedTile, [field]: value });
    }
  };

  const handleExpand = (projectId: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? projectId : false);
    if (isExpanded) {
      setTileDataExpanded(projectId);
      setSettingsExpanded(projectId);
    } else {
      setTileDataExpanded(false);
      setSettingsExpanded(false);
    }
  };

  const handleTileDataExpand = (projectId: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setTileDataExpanded(isExpanded ? projectId : false);
  };

  const handleSettingsExpand = (projectId: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setSettingsExpanded(isExpanded ? projectId : false);
  };

  if (!profile) {
    return null; // Or a loading spinner
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box
        sx={{
          flexGrow: 1,
          pt: { xs: '64px', md: '80px' },
          pb: { xs: '80px', md: '100px' },
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 2, color: '#1b75bc' }}>
            User Profile
          </Typography>
          <Typography align="center" sx={{ mb: 4, color: 'text.secondary' }}>
            Welcome back {profile.username}, manage your saved projects and custom tiles. Update contact preferences and more.
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          {/* Saved Projects Section */}
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b75bc' }}>
                Saved Projects
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {projects.length === 0 ? (
                <Typography align="center" color="text.secondary">
                  No saved projects found. Start by saving a project from the Calculator.
                </Typography>
              ) : (
                <Box sx={{ overflowX: 'auto' }}>
                  {projects.map((project) => (
                    <Accordion key={project.id} expanded={expanded === project.id} onChange={handleExpand(project.id)}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' }, fontWeight: 'bold' }}>
                              {project.projectName}
                            </Typography>
                            <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' }, color: 'text.secondary' }}>
                              {new Date(project.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Box>
                            <IconButton onClick={() => handleProjectEdit(project)} color="primary">
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleProjectDelete(project.id)} color="error">
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        {/* Tile Data and Settings Side by Side */}
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Accordion expanded={tileDataExpanded === project.id} onChange={handleTileDataExpand(project.id)}>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6" sx={{ fontWeight: 'medium', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                  Tile Data
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Box sx={{ overflowX: 'auto' }}>
                                  <Table sx={{ minWidth: 250, backgroundColor: 'grey.200' }}>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Material Type</TableCell>
                                        <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                          {project.settings.materialType}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Tile Length</TableCell>
                                        <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                          {project.settings.slateTileHeight} mm
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Tile Width</TableCell>
                                        <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                          {project.settings.tileCoverWidth} mm
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Min Gauge</TableCell>
                                        <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                          {project.settings.minGauge} mm
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Max Gauge</TableCell>
                                        <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                          {project.settings.maxGauge} mm
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Min Spacing</TableCell>
                                        <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                          {project.settings.minSpacing} mm
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Max Spacing</TableCell>
                                        <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                          {project.settings.maxSpacing} mm
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Cross-Bonded</TableCell>
                                        <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                          {project.settings.crossBonded}
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </Box>
                              </AccordionDetails>
                            </Accordion>
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Accordion expanded={settingsExpanded === project.id} onChange={handleSettingsExpand(project.id)}>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6" sx={{ fontWeight: 'medium', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                  Settings
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Box sx={{ overflowX: 'auto' }}>
                                  <Table sx={{ minWidth: 250, backgroundColor: 'grey.200' }}>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Left Verge</TableCell>
                                        <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                          {project.settings.leftVergeType}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Right Verge</TableCell>
                                        <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                          {project.settings.rightVergeType}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Use LH Tile</TableCell>
                                        <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                          {project.settings.useLHTile}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Gutter Overhang</TableCell>
                                        <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                          {project.settings.gutterOverhang} mm
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Use Dry Ridge</TableCell>
                                        <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                          {project.settings.useDryRidge}
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </Box>
                              </AccordionDetails>
                            </Accordion>
                          </Box>
                        </Box>
                        {/* Vertical Results */}
                        {project.rafterHeights.some((h: number) => h > 0) && project.verticalResults && (
                          <Accordion sx={{ mb: 1 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'text.primary', fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                                Vertical Results
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              {project.verticalResults.solution.rafterResults.map((r: any, index: number) => (
                                project.rafterHeights[index] > 0 && (
                                  <Accordion key={index} sx={{ mb: 1 }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                      <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'text.primary', fontSize: { xs: '0.9rem', sm: '1.1rem' } }}>
                                        Rafter {index + 1}
                                      </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                      <Box sx={{ overflowX: 'auto' }}>
                                        <Table sx={{ minWidth: 500, backgroundColor: 'primary.main', color: 'white' }}>
                                          <TableBody>
                                            {project.settings.useDryRidge === 'YES' && (
                                              <TableRow>
                                                <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>Under Eave Batten</TableCell>
                                                <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                                  {project.verticalResults.underEaveBatten} mm
                                                </TableCell>
                                              </TableRow>
                                            )}
                                            {['Slate', 'Fibre Cement Slate', 'Plain Tile'].includes(project.settings.materialType) && (
                                              <TableRow>
                                                <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>Eave Batten</TableCell>
                                                <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                                  {project.verticalResults.eaveBatten} mm
                                                </TableCell>
                                              </TableRow>
                                            )}
                                            <TableRow>
                                              <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>1st Batten</TableCell>
                                              <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                                {project.verticalResults.firstBatten} mm
                                              </TableCell>
                                            </TableRow>
                                            {project.verticalResults.solution.type === 'full' && (
                                              <>
                                                <TableRow>
                                                  <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>Batten Gauge</TableCell>
                                                  <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                                    {r.battenGauge} mm
                                                  </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                  <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>Ridge Offset</TableCell>
                                                  <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                                    {r.effectiveRidgeOffset} mm
                                                  </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                  <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>Total</TableCell>
                                                  <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                                    {project.verticalResults.firstBatten + (project.verticalResults.solution.n_spaces - 1) * (r.battenGauge || 0) + r.effectiveRidgeOffset} mm
                                                  </TableCell>
                                                </TableRow>
                                              </>
                                            )}
                                            {project.verticalResults.solution.type === 'split' && (
                                              <>
                                                <TableRow>
                                                  <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>Gauge 1</TableCell>
                                                  <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                                    {r.gauge1} mm
                                                  </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                  <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>Gauge 2</TableCell>
                                                  <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                                    {r.gauge2} mm
                                                  </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                  <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>Ridge Offset</TableCell>
                                                  <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                                    {r.effectiveRidgeOffset} mm
                                                  </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                  <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>Total</TableCell>
                                                  <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                                    {project.verticalResults.firstBatten + (project.verticalResults.solution.n1! * (r.gauge1 || 0) + project.verticalResults.solution.n2! * (r.gauge2 || 0)) + r.effectiveRidgeOffset} mm
                                                  </TableCell>
                                                </TableRow>
                                              </>
                                            )}
                                            {project.verticalResults.solution.type === 'cut' && (
                                              <>
                                                <TableRow>
                                                  <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>Cut Course Gauge</TableCell>
                                                  <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                                    {r.cutCourseGauge} mm
                                                  </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                  <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>Full Courses Batten Gauge</TableCell>
                                                  <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                                    {r.fullCourses} @ {project.settings.maxGauge} mm
                                                  </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                  <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>Ridge Offset</TableCell>
                                                  <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                                    {r.effectiveRidgeOffset} mm
                                                  </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                  <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>Total</TableCell>
                                                  <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                                    {project.verticalResults.firstBatten + (r.cutCourseGauge || 0) + (r.fullCourses || 0) * project.settings.maxGauge + r.effectiveRidgeOffset} mm
                                                  </TableCell>
                                                </TableRow>
                                              </>
                                            )}
                                          </TableBody>
                                        </Table>
                                      </Box>
                                    </AccordionDetails>
                                  </Accordion>
                                )
                              ))}
                            </AccordionDetails>
                          </Accordion>
                        )}
                        {/* Horizontal Results */}
                        {project.widths.some((w: number) => w > 0) && project.horizontalResults && (
                          <Accordion sx={{ mb: 1 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'text.primary', fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                                Horizontal Results
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              {project.horizontalResults.solution.widthResults.map((r: any, index: number) => (
                                project.widths[index] > 0 && (
                                  <Accordion key={index} sx={{ mb: 1 }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                      <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'text.primary', fontSize: { xs: '0.9rem', sm: '1.1rem' } }}>
                                        Width {index + 1}
                                      </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                      <Box sx={{ overflowX: 'auto' }}>
                                        <Table sx={{ minWidth: 500, backgroundColor: 'primary.main', color: 'white' }}>
                                          <TableBody>
                                            <TableRow>
                                              <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>Starting Width</TableCell>
                                              <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                                {project.widths[index]} mm
                                              </TableCell>
                                            </TableRow>
                                            <TableRow>
                                              <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>Final Width</TableCell>
                                              <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                                {project.widths[index] + r.overhangLeft + r.overhangRight} mm
                                              </TableCell>
                                            </TableRow>
                                            <TableRow>
                                              <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>Total Tiles Wide</TableCell>
                                              <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                                {project.horizontalResults.tilesWide}
                                              </TableCell>
                                            </TableRow>
                                            <TableRow>
                                              <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>Left Overhang</TableCell>
                                              <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                                {r.overhangLeft} mm
                                              </TableCell>
                                            </TableRow>
                                            <TableRow>
                                              <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>Right Overhang</TableCell>
                                              <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                                {r.overhangRight} mm
                                              </TableCell>
                                            </TableRow>
                                            <TableRow>
                                              <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>1st Mark</TableCell>
                                              <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                                {r.firstMark} mm
                                              </TableCell>
                                            </TableRow>
                                            {r.secondMark && (
                                              <TableRow>
                                                <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>2nd Mark</TableCell>
                                                <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                                  {r.secondMark} mm
                                                </TableCell>
                                              </TableRow>
                                            )}
                                            <TableRow>
                                              <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>Chalk Marks</TableCell>
                                              <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                                {r.totalSets} @ {r.adjustedMarks} mm
                                              </TableCell>
                                            </TableRow>
                                          </TableBody>
                                        </Table>
                                      </Box>
                                      <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary', fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                                        *measure from LH brickwork, Marks In sets of {project.horizontalResults.setSize}
                                      </Typography>
                                    </AccordionDetails>
                                  </Accordion>
                                )
                              ))}
                            </AccordionDetails>
                          </Accordion>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}
            </AccordionDetails>
          </Accordion>

          {/* Custom Tiles Section (Pro Users Only) */}
          {user.subscription === 'pro' && (
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b75bc' }}>
                  Custom Tiles
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {tiles.length === 0 ? (
                  <Typography align="center" color="text.secondary">
                    No custom tiles found. Add a new tile in the Calculator.
                  </Typography>
                ) : (
                  <Box sx={{ overflowX: 'auto' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Length (mm)</TableCell>
                          <TableCell>Width (mm)</TableCell>
                          <TableCell>Min Gauge (mm)</TableCell>
                          <TableCell>Max Gauge (mm)</TableCell>
                          <TableCell>Min Spacing (mm)</TableCell>
                          <TableCell>Max Spacing (mm)</TableCell>
                          <TableCell>LH Tile Width (mm)</TableCell>
                          <TableCell>Cross-Bonded</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tiles.map((tile) => (
                          <TableRow key={tile.id}>
                            <TableCell>{tile.name}</TableCell>
                            <TableCell>{tile.type}</TableCell>
                            <TableCell>{tile.length}</TableCell>
                            <TableCell>{tile.width}</TableCell>
                            <TableCell>{tile.mingauge}</TableCell>
                            <TableCell>{tile.maxgauge}</TableCell>
                            <TableCell>{tile.minspacing}</TableCell>
                            <TableCell>{tile.maxspacing}</TableCell>
                            <TableCell>{tile.lhTileWidth}</TableCell>
                            <TableCell>{tile.crossbonded}</TableCell>
                            <TableCell>
                              <IconButton onClick={() => handleTileEdit(tile)} color="primary">
                                <EditIcon />
                              </IconButton>
                              <IconButton onClick={() => handleTileDelete(tile.id)} color="error">
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          )}

          {/* Update Profile Section (with Change Password) */}
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b75bc' }}>
                Update Profile
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                {/* Update Profile Form */}
                <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 2 }}>
                  Update Contact Information
                </Typography>
                <form onSubmit={handleProfileSubmit}>
                  <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    variant="outlined"
                  />
                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    variant="outlined"
                  />
                  <TextField
                    label="Subscription"
                    value={profile.subscription}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    disabled
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2, py: 1.5, fontSize: '1.2rem' }}
                  >
                    Update Profile
                  </Button>
                </form>

                {/* Change Password Form */}
                <Typography variant="h6" sx={{ fontWeight: 'medium', mt: 4, mb: 2 }}>
                  Change Password
                </Typography>
                <form onSubmit={handlePasswordSubmit}>
                  <TextField
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    variant="outlined"
                  />
                  <TextField
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    variant="outlined"
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2, py: 1.5, fontSize: '1.2rem' }}
                  >
                    Change Password
                  </Button>
                </form>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Container>
      </Box>
      <Footer />

      {/* Edit Tile Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Tile</DialogTitle>
        <DialogContent>
          {selectedTile && (
            <Box component="form" onSubmit={handleTileSubmit} sx={{ mt: 2 }}>
              <TextField
                label="Name"
                value={selectedTile.name}
                onChange={(e) => handleTileChange('name', e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select
                  value={selectedTile.type}
                  onChange={(e) => handleTileChange('type', e.target.value)}
                  required
                >
                  <MenuItem value="Slate">Slate</MenuItem>
                  <MenuItem value="Tile">Tile</MenuItem>
                  <MenuItem value="Fibre Cement Slate">Fibre Cement Slate</MenuItem>
                  <MenuItem value="Plain Tile">Plain Tile</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Length (mm)"
                type="number"
                value={selectedTile.length}
                onChange={(e) => handleTileChange('length', Number(e.target.value))}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Width (mm)"
                type="number"
                value={selectedTile.width}
                onChange={(e) => handleTileChange('width', Number(e.target.value))}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Min Gauge (mm)"
                type="number"
                value={selectedTile.mingauge}
                onChange={(e) => handleTileChange('mingauge', Number(e.target.value))}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Max Gauge (mm)"
                type="number"
                value={selectedTile.maxgauge}
                onChange={(e) => handleTileChange('maxgauge', Number(e.target.value))}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Min Spacing (mm)"
                type="number"
                value={selectedTile.minspacing}
                onChange={(e) => handleTileChange('minspacing', Number(e.target.value))}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Max Spacing (mm)"
                type="number"
                value={selectedTile.maxspacing}
                onChange={(e) => handleTileChange('maxspacing', Number(e.target.value))}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="LH Tile Width (mm)"
                type="number"
                value={selectedTile.lhTileWidth}
                onChange={(e) => handleTileChange('lhTileWidth', Number(e.target.value))}
                fullWidth
                margin="normal"
                inputProps={{ min: 0 }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Cross-Bonded</InputLabel>
                <Select
                  value={selectedTile.crossbonded}
                  onChange={(e) => handleTileChange('crossbonded', e.target.value as 'YES' | 'NO')}
                  required
                >
                  <MenuItem value="YES">Yes</MenuItem>
                  <MenuItem value="NO">No</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleTileSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;