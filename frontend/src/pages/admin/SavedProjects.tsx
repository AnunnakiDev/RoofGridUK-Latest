import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

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
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | false>(false);
  const [tileDataExpanded, setTileDataExpanded] = useState<number | false>(false);
  const [settingsExpanded, setSettingsExpanded] = useState<number | false>(false);
  const [sectionExpanded, setSectionExpanded] = useState<boolean>(true); // Open by default

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/api/projects');
        setProjects(response.data);
        // Open all project accordions by default
        if (response.data.length > 0) {
          setExpanded(response.data[0].id);
          setTileDataExpanded(response.data[0].id);
          setSettingsExpanded(response.data[0].id);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch saved projects');
      }
    };

    fetchProjects();
  }, []);

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

  return (
    <>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Accordion
        expanded={sectionExpanded}
        onChange={(event, isExpanded) => setSectionExpanded(isExpanded)}
        sx={{ mb: 2 }}
      >
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
            projects.map((project) => (
              <Accordion
                key={project.id}
                expanded={expanded === project.id}
                onChange={handleExpand(project.id)}
                sx={{ mb: 1 }}
              >
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
                  <Box sx={{ overflowX: 'auto' }}>
                    {/* Tile Data and Settings Side by Side */}
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Accordion
                          expanded={tileDataExpanded === project.id}
                          onChange={handleTileDataExpand(project.id)}
                          defaultExpanded // Open by default
                        >
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
                        <Accordion
                          expanded={settingsExpanded === project.id}
                          onChange={handleSettingsExpand(project.id)}
                          defaultExpanded // Open by default
                        >
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
                      <Accordion sx={{ mb: 1 }} defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'text.primary', fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                            Vertical Results
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {project.verticalResults.solution.rafterResults.map((r: any, index: number) => (
                            project.rafterHeights[index] > 0 && (
                              <Accordion key={index} sx={{ mb: 1 }} defaultExpanded>
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
                      <Accordion sx={{ mb: 1 }} defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'text.primary', fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                            Horizontal Results
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {project.horizontalResults.solution.widthResults.map((r: any, index: number) => (
                            project.widths[index] > 0 && (
                              <Accordion key={index} sx={{ mb: 1 }} defaultExpanded>
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
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default SavedProjects;