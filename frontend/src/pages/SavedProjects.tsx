import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Tooltip,
  CircularProgress,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Grid,
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

const SavedProjects: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | false>(false);
  const [tileDataExpanded, setTileDataExpanded] = useState<number | false>(false);
  const [settingsExpanded, setSettingsExpanded] = useState<number | false>(false);

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
    navigate('/calculator', { state: { project } });
  };

  // Handle project accordion expand/collapse
  const handleExpand = (projectId: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? projectId : false);
    // Reset Tile Data and Settings accordions when the project accordion is collapsed
    if (!isExpanded) {
      setTileDataExpanded(false);
      setSettingsExpanded(false);
    }
  };

  // Handle Tile Data accordion expand/collapse
  const handleTileDataExpand = (projectId: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setTileDataExpanded(isExpanded ? projectId : false);
  };

  // Handle Settings accordion expand/collapse
  const handleSettingsExpand = (projectId: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setSettingsExpanded(isExpanded ? projectId : false);
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
          maxWidth: { xs: '100%', sm: 750, md: 900 },
          mx: 'auto',
          p: { xs: 1, sm: 2, md: 3 },
          pt: { xs: '64px', md: '80px' },
          pb: { xs: '120px', md: '140px' },
          minHeight: 'calc(100vh - 128px)',
          overflow: 'auto',
          px: { xs: 1, sm: 2 },
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
          <Paper sx={{ borderRadius: 2, boxShadow: 2 }}>
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
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Tile Data and Settings Side by Side */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
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
                    </Grid>
                    <Grid item xs={12} sm={6}>
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
                    </Grid>
                  </Grid>
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
          </Paper>
        )}
      </Box>
      <Footer />
    </Box>
  );
};

export default SavedProjects;