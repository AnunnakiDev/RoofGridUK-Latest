import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
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
  TextField,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
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

interface Tile {
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
  isPersonal?: boolean;
}

const AdminProfile: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [personalTiles, setPersonalTiles] = useState<Tile[]>([]);
  const [defaultTiles, setDefaultTiles] = useState<Tile[]>([]);
  const [filteredTiles, setFilteredTiles] = useState<Tile[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openTileDialog, setOpenTileDialog] = useState(false);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [newTile, setNewTile] = useState<Tile | null>(null);
  const [expanded, setExpanded] = useState<number | false>(false);
  const [tileDataExpanded, setTileDataExpanded] = useState<number | false>(false);
  const [settingsExpanded, setSettingsExpanded] = useState<number | false>(false);
  const [expandedType, setExpandedType] = useState<string | false>(false);

  useEffect(() => {
    if (!user.id) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/profile');
      return;
    }

    const fetchProjects = async () => {
      try {
        const response = await api.get('/api/projects');
        setProjects(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch saved projects');
      }
    };

    const fetchPersonalTiles = async () => {
      try {
        const response = await api.get('/api/users/tiles');
        const tilesWithFlag = response.data.map((tile: Tile) => ({
          ...tile,
          isPersonal: true,
          type: normalizeTileType(tile.type),
        }));
        setPersonalTiles(tilesWithFlag);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch personal tiles');
      }
    };

    const fetchDefaultTiles = async () => {
      try {
        const response = await api.get('/api/tiles');
        const normalizedTiles = response.data.map((tile: Tile) => ({
          ...tile,
          type: normalizeTileType(tile.type),
        }));
        const sortedTiles = normalizedTiles.sort((a: Tile, b: Tile) => {
          const typeA = a.type.toLowerCase();
          const typeB = b.type.toLowerCase();
          if (typeA < typeB) return -1;
          if (typeA > typeB) return 1;
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
        });
        setDefaultTiles(sortedTiles);
        setFilteredTiles(sortedTiles);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch default tiles');
      }
    };

    fetchProjects();
    if (user.subscription === 'pro') {
      fetchPersonalTiles();
    }
    fetchDefaultTiles();
  }, [user.id, user.role, user.subscription, navigate]);

  useEffect(() => {
    // Filter tiles based on search query
    const filtered = defaultTiles.filter((tile) =>
      tile.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTiles(filtered);
  }, [searchQuery, defaultTiles]);

  const normalizeTileType = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'fibre-cement-slate':
        return 'Fibre Cement Slate';
      case 'interlocking-tile':
        return 'Interlocking Tile';
      case 'plain-tile':
        return 'Plain Tile';
      case 'slate':
        return 'Slate';
      case 'tile':
        return 'Tile';
      default:
        return type; // Fallback, though this should not happen with predefined types
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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

  const handlePersonalTileEdit = (tile: Tile) => {
    console.log('Editing personal tile:', tile);
    setSelectedTile({ ...tile, isPersonal: true });
    setNewTile(null);
    setOpenTileDialog(true);
  };

  const handlePersonalTileDelete = async (tileId: number) => {
    if (window.confirm('Are you sure you want to delete this tile?')) {
      try {
        await api.delete(`/api/users/tiles/${tileId}`);
        setPersonalTiles(personalTiles.filter((tile) => tile.id !== tileId));
        setSuccess('Personal tile deleted successfully');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete personal tile');
      }
    }
  };

  const handlePersonalTileCalculate = (tile: Tile) => {
    navigate('/calculator', { state: { tile } });
  };

  const handleDefaultTileAdd = () => {
    setSelectedTile(null);
    setNewTile({
      id: 0,
      name: '',
      type: '',
      length: 0,
      width: 0,
      mingauge: 75,
      maxgauge: 325,
      minspacing: 3,
      maxspacing: 7,
      lhTileWidth: 0,
      crossbonded: 'NO',
    });
    setOpenTileDialog(true);
  };

  const handleDefaultTileEdit = (tile: Tile) => {
    console.log('Editing default tile:', tile);
    setSelectedTile({ ...tile, isPersonal: false });
    setNewTile(null);
    setOpenTileDialog(true);
  };

  const handleDefaultTileDelete = async (tileId: number) => {
    if (window.confirm('Are you sure you want to delete this tile?')) {
      try {
        await api.delete(`/api/tiles/${tileId}`);
        setDefaultTiles(defaultTiles.filter((tile) => tile.id !== tileId));
        setFilteredTiles(filteredTiles.filter((tile) => tile.id !== tileId));
        setSuccess('Default tile deleted successfully');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete default tile');
      }
    }
  };

  const handleTileDialogClose = () => {
    setOpenTileDialog(false);
    setSelectedTile(null);
    setNewTile(null);
  };

  const handleTileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTile) {
      // Add new default tile
      const payload = {
        name: newTile.name,
        type: newTile.type,
        length: Number(newTile.length),
        width: Number(newTile.width),
        mingauge: Number(newTile.mingauge),
        maxgauge: Number(newTile.maxgauge),
        minspacing: Number(newTile.minspacing),
        maxspacing: Number(newTile.maxspacing),
        lhTileWidth: Number(newTile.lhTileWidth),
        crossbonded: newTile.crossbonded,
      };
      try {
        const response = await api.post('/api/tiles', payload);
        const newTileData = { ...response.data, type: normalizeTileType(response.data.type) };
        setDefaultTiles([...defaultTiles, newTileData]);
        setFilteredTiles([...filteredTiles, newTileData]);
        setSuccess('Default tile added successfully');
        handleTileDialogClose();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to add default tile');
      }
    } else if (selectedTile) {
      // Edit existing tile (personal or default)
      const payload = {
        name: selectedTile.name,
        type: selectedTile.type,
        length: Number(selectedTile.length),
        width: Number(selectedTile.width),
        mingauge: Number(selectedTile.mingauge),
        maxgauge: Number(selectedTile.maxgauge),
        minspacing: Number(selectedTile.minspacing),
        maxspacing: Number(selectedTile.maxspacing),
        lhTileWidth: Number(selectedTile.lhTileWidth),
        crossbonded: selectedTile.crossbonded,
      };
      try {
        if (selectedTile.isPersonal) {
          // Personal tile
          const response = await api.put(`/api/users/tiles/${selectedTile.id}`, payload);
          const updatedTile = { ...response.data, isPersonal: true, type: normalizeTileType(response.data.type) };
          setPersonalTiles(personalTiles.map((tile) => (tile.id === selectedTile.id ? updatedTile : tile)));
          setSuccess('Personal tile updated successfully');
        } else {
          // Default tile
          const response = await api.put(`/api/tiles/${selectedTile.id}`, payload);
          const updatedTile = { ...response.data, type: normalizeTileType(response.data.type) };
          setDefaultTiles(defaultTiles.map((tile) => (tile.id === selectedTile.id ? updatedTile : tile)));
          setFilteredTiles(filteredTiles.map((tile) => (tile.id === selectedTile.id ? updatedTile : tile)));
          setSuccess('Default tile updated successfully');
        }
        handleTileDialogClose();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to update tile');
      }
    }
  };

  const handleTileChange = (field: keyof Tile, value: any) => {
    if (newTile) {
      setNewTile({ ...newTile, [field]: value });
    } else if (selectedTile) {
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

  const handleTypeExpand = (type: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedType(isExpanded ? type : false);
  };

  // Group tiles by type
  const tilesByType = filteredTiles.reduce((acc: { [key: string]: Tile[] }, tile: Tile) => {
    if (!acc[tile.type]) {
      acc[tile.type] = [];
    }
    acc[tile.type].push(tile);
    return acc;
  }, {});

  // Sort types alphabetically
  const sortedTypes = Object.keys(tilesByType).sort();

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
            Admin Profile
          </Typography>
          <Typography align="center" sx={{ mb: 4, color: 'text.secondary' }}>
            Welcome back {user.email}, manage default tiles, users, and your saved projects and personal tiles.
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
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}
            </AccordionDetails>
          </Accordion>

          {/* Personal Tiles Section (Pro Users Only) */}
          {user.subscription === 'pro' && (
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b75bc' }}>
                  Personal Tiles
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {personalTiles.length === 0 ? (
                  <Typography align="center" color="text.secondary">
                    No personal tiles found. Add a new tile in the Calculator.
                  </Typography>
                ) : (
                  <Box>
                    {personalTiles.map((tile) => (
                      <Accordion key={tile.id} sx={{ mb: 1 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                              {tile.name}
                            </Typography>
                            <Box>
                              <IconButton onClick={(e) => { e.stopPropagation(); handlePersonalTileEdit(tile); }} color="primary">
                                <EditIcon />
                              </IconButton>
                              <IconButton onClick={(e) => { e.stopPropagation(); handlePersonalTileDelete(tile.id); }} color="error">
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box sx={{ overflowX: 'auto' }}>
                            <Table sx={{ minWidth: 250, backgroundColor: 'grey.200' }}>
                              <TableBody>
                                <TableRow>
                                  <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Material Type</TableCell>
                                  <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                    {tile.type}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Tile Length</TableCell>
                                  <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                    {tile.length} mm
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Tile Width</TableCell>
                                  <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                    {tile.width} mm
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Min Gauge</TableCell>
                                  <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                    {tile.mingauge ?? 75} mm
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Max Gauge</TableCell>
                                  <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                    {tile.maxgauge ?? 325} mm
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Min Spacing</TableCell>
                                  <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                    {tile.minspacing ?? 3} mm
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Max Spacing</TableCell>
                                  <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                    {tile.maxspacing ?? 7} mm
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>LH Tile Width</TableCell>
                                  <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                    {tile.lhTileWidth} mm
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Cross-Bonded</TableCell>
                                  <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                    {tile.crossbonded}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Box>
                          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handlePersonalTileEdit(tile)}
                              sx={{ py: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handlePersonalTileCalculate(tile)}
                              sx={{ py: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                              Calculate
                            </Button>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          )}

          {/* Tile Management Section (Admin Only) */}
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b75bc' }}>
                Tile Management
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <TextField
                  label="Search Tiles"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  sx={{ width: '300px' }}
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDefaultTileAdd}
                  sx={{ py: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}
                >
                  Add New Tile
                </Button>
              </Box>
              {sortedTypes.length === 0 ? (
                <Typography align="center" color="text.secondary">
                  No default tiles found. Add a new tile to get started.
                </Typography>
              ) : (
                <Box>
                  {sortedTypes.map((type) => (
                    <Accordion
                      key={type}
                      expanded={expandedType === type}
                      onChange={handleTypeExpand(type)}
                      sx={{ mb: 1 }}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                          {type} ({tilesByType[type].length})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {tilesByType[type].map((tile) => (
                          <Accordion key={tile.id} sx={{ mb: 1 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                                  {tile.name}
                                </Typography>
                                <Box>
                                  <IconButton onClick={(e) => { e.stopPropagation(); handleDefaultTileEdit(tile); }} color="primary">
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton onClick={(e) => { e.stopPropagation(); handleDefaultTileDelete(tile.id); }} color="error">
                                    <DeleteIcon />
                                  </IconButton>
                                </Box>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Box sx={{ overflowX: 'auto' }}>
                                <Table sx={{ minWidth: 250, backgroundColor: 'grey.200' }}>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Material Type</TableCell>
                                      <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                        {tile.type}
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Tile Length</TableCell>
                                      <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                        {tile.length} mm
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Tile Width</TableCell>
                                      <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                        {tile.width} mm
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Min Gauge</TableCell>
                                      <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                        {tile.mingauge ?? 75} mm
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Max Gauge</TableCell>
                                      <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                        {tile.maxgauge ?? 325} mm
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Min Spacing</TableCell>
                                      <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                        {tile.minspacing ?? 3} mm
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Max Spacing</TableCell>
                                      <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                        {tile.maxspacing ?? 7} mm
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>LH Tile Width</TableCell>
                                      <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                        {tile.lhTileWidth} mm
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Cross-Bonded</TableCell>
                                      <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                        {tile.crossbonded}
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}
            </AccordionDetails>
          </Accordion>

          {/* User Management Section (Placeholder) */}
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b75bc' }}>
                User Management
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography align="center" color="text.secondary">
                User management features coming soon.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Container>
      </Box>
      <Footer />

      {/* Tile Dialog (Add/Edit) */}
      <Dialog open={openTileDialog} onClose={handleTileDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>{newTile ? 'Add Default Tile' : 'Edit Tile'}</DialogTitle>
        <DialogContent>
          {(selectedTile || newTile) && (
            <Box component="form" onSubmit={handleTileSubmit} sx={{ mt: 2 }}>
              <TextField
                label="Name"
                value={newTile ? newTile.name : selectedTile?.name || ''}
                onChange={(e) => handleTileChange('name', e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select
                  value={newTile ? newTile.type : (selectedTile?.type || '')}
                  onChange={(e) => handleTileChange('type', e.target.value)}
                  required
                >
                  <MenuItem value="Slate">Slate</MenuItem>
                  <MenuItem value="Tile">Tile</MenuItem>
                  <MenuItem value="Fibre Cement Slate">Fibre Cement Slate</MenuItem>
                  <MenuItem value="Plain Tile">Plain Tile</MenuItem>
                  <MenuItem value="Interlocking Tile">Interlocking Tile</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Length (mm)"
                type="number"
                value={newTile ? newTile.length : selectedTile?.length || 0}
                onChange={(e) => handleTileChange('length', Number(e.target.value))}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Width (mm)"
                type="number"
                value={newTile ? newTile.width : selectedTile?.width || 0}
                onChange={(e) => handleTileChange('width', Number(e.target.value))}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Min Gauge (mm)"
                type="number"
                value={newTile ? newTile.mingauge : selectedTile?.mingauge || 0}
                onChange={(e) => handleTileChange('mingauge', Number(e.target.value))}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Max Gauge (mm)"
                type="number"
                value={newTile ? newTile.maxgauge : selectedTile?.maxgauge || 0}
                onChange={(e) => handleTileChange('maxgauge', Number(e.target.value))}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Min Spacing (mm)"
                type="number"
                value={newTile ? newTile.minspacing : selectedTile?.minspacing || 0}
                onChange={(e) => handleTileChange('minspacing', Number(e.target.value))}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Max Spacing (mm)"
                type="number"
                value={newTile ? newTile.maxspacing : selectedTile?.maxspacing || 0}
                onChange={(e) => handleTileChange('maxspacing', Number(e.target.value))}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="LH Tile Width (mm)"
                type="number"
                value={newTile ? newTile.lhTileWidth : selectedTile?.lhTileWidth || 0}
                onChange={(e) => handleTileChange('lhTileWidth', Number(e.target.value))}
                fullWidth
                margin="normal"
                inputProps={{ min: 0 }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Cross-Bonded</InputLabel>
                <Select
                  value={newTile ? newTile.crossbonded : selectedTile?.crossbonded || 'NO'}
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
          <Button onClick={handleTileDialogClose} color="secondary">
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

export default AdminProfile;