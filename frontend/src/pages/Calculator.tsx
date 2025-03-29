import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Autocomplete,
  Select,
  SelectChangeEvent,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stepper,
  Step,
  StepLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import api from '../services/api';
import { useUser } from '../context/UserContext';
import { calculateVertical, VerticalResult, RafterResult } from '../utils/calculateVertical';
import { calculateHorizontal, HorizontalResult, WidthResult } from '../utils/calculateHorizontal';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Tile {
  id: number;
  name: string;
  type: string;
  length: number;
  width: number;
  crossbonded: string;
  mingauge: number | null;
  maxgauge: number | null;
  minspacing: number | null;
  maxspacing: number | null;
  lhTileWidth: number;
  isPersonal?: boolean;
}

interface FormInputs {
  tileSelection: string;
  tileName: string;
  rafterHeights: number[];
  rafterHeightNames: string[];
  widths: number[];
  widthNames: string[];
  gutterOverhang: number;
  materialType: string;
  slateTileHeight: number;
  tileCoverWidth: number;
  minGauge: number | null;
  maxGauge: number | null;
  minSpacing: number | null;
  maxSpacing: number | null;
  useDryRidge: 'YES' | 'NO';
  leftVergeType: 'Wet' | 'Dry' | 'Abutment';
  rightVergeType: 'Wet' | 'Dry' | 'Abutment';
  useLHTile: 'YES' | 'NO';
  lhTileWidth: number;
  crossBonded: 'YES' | 'NO';
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
  };
  verticalResults: any;
  horizontalResults: any;
  totalResults: {
    totalCourses: number;
    totalTiles: number;
    halfTiles: number;
  } | null;
}

const Calculator: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [isTileDataExpanded, setIsTileDataExpanded] = useState(true);
  const [verticalExpanded, setVerticalExpanded] = useState(false);
  const [horizontalExpanded, setHorizontalExpanded] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [inputs, setInputs] = useState<FormInputs>({
    tileSelection: '',
    tileName: '',
    rafterHeights: [0],
    rafterHeightNames: ['Rafter 1'],
    widths: [0],
    widthNames: ['Width 1'],
    gutterOverhang: 50,
    materialType: '',
    slateTileHeight: 0,
    tileCoverWidth: 0,
    minGauge: 75,
    maxGauge: 325,
    minSpacing: 3,
    maxSpacing: 7,
    useDryRidge: 'NO',
    leftVergeType: 'Wet',
    rightVergeType: 'Wet',
    useLHTile: 'NO',
    lhTileWidth: 0,
    crossBonded: 'NO',
  });
  const [results, setResults] = useState<{
    vertical: VerticalResult;
    horizontal: HorizontalResult;
    totalCourses: number;
    totalTiles: number;
    halfTiles: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stepErrors, setStepErrors] = useState<string[]>([]);
  const [tileDataExpandedResults, setTileDataExpandedResults] = useState(false);
  const [settingsExpandedResults, setSettingsExpandedResults] = useState(false);

  useEffect(() => {
    if (location.state) {
      if ((location.state as { project: Project }).project) {
        const { project } = location.state as { project: Project };
        setProjectName(project.projectName);
        setInputs({
          ...inputs,
          rafterHeights: project.rafterHeights,
          widths: project.widths,
          gutterOverhang: project.settings.gutterOverhang,
          useDryRidge: project.settings.useDryRidge,
          leftVergeType: project.settings.leftVergeType,
          rightVergeType: project.settings.rightVergeType,
          useLHTile: project.settings.useLHTile,
          lhTileWidth: project.settings.lhTileWidth,
        });
        setResults({
          vertical: project.verticalResults,
          horizontal: project.horizontalResults,
          totalCourses: project.totalResults?.totalCourses || 0,
          totalTiles: project.totalResults?.totalTiles || 0,
          halfTiles: project.totalResults?.totalCourses || 0,
        });
        setActiveStep(3);
        setTileDataExpandedResults(true);
        setSettingsExpandedResults(true);
      } else if ((location.state as { tile: Tile }).tile) {
        const { tile } = location.state as { tile: Tile };
        setInputs({
          ...inputs,
          tileSelection: tile.id.toString(),
          tileName: tile.name,
          materialType: tile.type,
          slateTileHeight: tile.length,
          tileCoverWidth: tile.width,
          minGauge: tile.mingauge ?? 75,
          maxGauge: tile.maxgauge ?? 325,
          minSpacing: tile.minspacing ?? 3,
          maxSpacing: tile.maxspacing ?? 7,
          lhTileWidth: tile.lhTileWidth,
          crossBonded: tile.crossbonded as 'YES' | 'NO',
        });
        setSelectedTile({ ...tile, isPersonal: true });
        setIsTileDataExpanded(true);
        setActiveStep(0); // Stay on "Choose Tile" step to show prefilled data
      }
    }
  }, [location.state]);

    useEffect(() => {
    const fetchTiles = async () => {
      try {
        const defaultTilesResponse = await api.get('/api/tiles');
        const defaultTiles = defaultTilesResponse.data.map((tile: Tile) => ({ ...tile, isPersonal: false }));
        const tilesList = [...defaultTiles];

        if (user.subscription === 'pro') {
          const personalTilesResponse = await api.get('/api/users/tiles');
          const personalTiles = personalTilesResponse.data.map((tile: Tile) => ({ ...tile, isPersonal: true }));
          tilesList.push(...personalTiles);
        }

        const uniqueTilesMap = new Map<string, Tile>();
        tilesList.forEach((tile) => {
          if (!uniqueTilesMap.has(tile.name)) {
            uniqueTilesMap.set(tile.name, tile);
          }
        });
        const uniqueTiles = Array.from(uniqueTilesMap.values());

        uniqueTiles.sort((a: Tile, b: Tile) => {
          const typeA = a.type.toLowerCase();
          const typeB = b.type.toLowerCase();
          if (typeA < typeB) return -1;
          if (typeA > typeB) return 1;
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
        });

        setTiles(uniqueTiles);
      } catch (err) {
        console.error('Error fetching tiles:', err);
        setError('Failed to fetch tiles');
      }
    };

    if (user.subscription === 'pro') {
      fetchTiles(); // Only fetch for Pro users
    } else {
      setTiles([]); // Clear tiles for free users
    }
  }, [user.subscription]);
  useEffect(() => {
    if (!inputs.rafterHeights.some(h => h > 0)) {
      setVerticalExpanded(false);
    }
  }, [inputs.rafterHeights]);

  useEffect(() => {
    if (!inputs.widths.some(w => w > 0)) {
      setHorizontalExpanded(false);
    }
  }, [inputs.widths]);

  useEffect(() => {
    setIsTileDataExpanded(selectedTile === null || selectedTile !== null);
  }, [selectedTile]);

  const handleTileSelect = (event: React.SyntheticEvent, value: Tile | null) => {
    if (!value) {
      setSelectedTile(null);
      setInputs({
        ...inputs,
        tileSelection: '',
        tileName: '',
        materialType: '',
        slateTileHeight: 0,
        tileCoverWidth: 0,
        minGauge: 75,
        maxGauge: 325,
        minSpacing: 3,
        maxSpacing: 7,
        lhTileWidth: 0,
        crossBonded: 'NO',
      });
      return;
    }

    setSelectedTile(value);
    let materialType: string;
    switch (value.type.toLowerCase()) {
      case 'slate':
        materialType = 'Slate';
        break;
      case 'fibre-cement-slate':
        materialType = 'Fibre Cement Slate';
        break;
      case 'interlocking-tile':
      case 'pantile':
        materialType = 'Tile';
        break;
      case 'plain-tile':
        materialType = 'Plain Tile';
        break;
      default:
        materialType = value.type;
    }
    const crossBondedValue = value.crossbonded === 'YES' || value.crossbonded === 'NO' ? value.crossbonded : 'NO';
    setInputs({
      ...inputs,
      tileSelection: value.id.toString(),
      tileName: value.name,
      materialType,
      slateTileHeight: value.length,
      tileCoverWidth: value.width,
      minGauge: value.mingauge ?? 75,
      maxGauge: value.maxgauge ?? 325,
      minSpacing: value.minspacing ?? 3,
      maxSpacing: value.maxspacing ?? 7,
      lhTileWidth: value.lhTileWidth || 0,
      crossBonded: crossBondedValue as 'YES' | 'NO',
    });
  };

  const addRafterHeight = () => {
    setInputs({
      ...inputs,
      rafterHeights: [...inputs.rafterHeights, 0],
      rafterHeightNames: [...inputs.rafterHeightNames, `Rafter ${inputs.rafterHeights.length + 1}`],
    });
  };

  const updateRafterHeight = (index: number, value: string) => {
    const newRafterHeights = [...inputs.rafterHeights];
    newRafterHeights[index] = value ? Number(value) : 0;
    setInputs({ ...inputs, rafterHeights: newRafterHeights });
  };

  const updateRafterHeightName = (index: number, value: string) => {
    const newRafterHeightNames = [...inputs.rafterHeightNames];
    newRafterHeightNames[index] = value || `Rafter ${index + 1}`;
    setInputs({ ...inputs, rafterHeightNames: newRafterHeightNames });
  };

  const addWidth = () => {
    setInputs({
      ...inputs,
      widths: [...inputs.widths, 0],
      widthNames: [...inputs.widthNames, `Width ${inputs.widths.length + 1}`],
    });
  };

  const updateWidth = (index: number, value: string) => {
    const newWidths = [...inputs.widths];
    newWidths[index] = value ? Number(value) : 0;
    setInputs({ ...inputs, widths: newWidths });
  };

  const updateWidthName = (index: number, value: string) => {
    const newWidthNames = [...inputs.widthNames];
    newWidthNames[index] = value || `Width ${index + 1}`;
    setInputs({ ...inputs, widthNames: newWidthNames });
  };

  const validateStep = (step: number): boolean => {
    const errors: string[] = [];

    if (step === 0) {
      if (user.subscription === 'pro' && !inputs.tileSelection && !inputs.materialType) {
        errors.push('Please select a tile or input custom tile data.');
      }
      if (!inputs.materialType) {
        errors.push('Material Type is required.');
      }
      if (inputs.slateTileHeight <= 0) {
        errors.push('Tile Length must be greater than 0.');
      }
      if (inputs.tileCoverWidth <= 0) {
        errors.push('Tile Width must be greater than 0.');
      }
      if (inputs.minGauge !== null && inputs.minGauge <= 0) {
        errors.push('Min Gauge must be greater than 0 or null.');
      }
      if (inputs.maxGauge !== null && inputs.maxGauge <= 0) {
        errors.push('Max Gauge must be greater than 0 or null.');
      }
      if (inputs.minGauge !== null && inputs.maxGauge !== null && inputs.minGauge > inputs.maxGauge) {
        errors.push('Min Gauge must be less than or equal to Max Gauge.');
      }
      if (inputs.minSpacing !== null && inputs.minSpacing <= 0) {
        errors.push('Min Spacing must be greater than 0 or null.');
      }
      if (inputs.maxSpacing !== null && inputs.maxSpacing <= 0) {
        errors.push('Max Spacing must be greater than 0 or null.');
      }
      if (inputs.minSpacing !== null && inputs.maxSpacing !== null && inputs.minSpacing > inputs.maxSpacing) {
        errors.push('Min Spacing must be less than or equal to Max Spacing.');
      }
      if (inputs.lhTileWidth < 0) {
        errors.push('LH Tile Width must be 0 or greater.');
      }
      if (!inputs.tileName) {
        errors.push('Tile Name is required.');
      }
      if (!inputs.crossBonded) {
        errors.push('Cross-Bonded must be set to YES or NO.');
      }
    } else if (step === 1) {
      const hasValidRafter = inputs.rafterHeights.some(h => h > 0);
      const hasValidWidth = inputs.widths.some(w => w > 0);
      if (!hasValidRafter && !hasValidWidth) {
        errors.push('At least one rafter height or width must be greater than 0.');
      }
      if (inputs.gutterOverhang < 0) {
        errors.push('Gutter overhang must be 0 or greater.');
      }
    }

    setStepErrors(errors);
    return errors.length === 0;
  };

  const handleSaveCustomTile = async () => {
    if (!validateStep(0)) return;

    try {
      const payload = {
        name: inputs.tileName,
        type: inputs.materialType,
        length: Number(inputs.slateTileHeight),
        width: Number(inputs.tileCoverWidth),
        mingauge: inputs.minGauge !== null ? Number(inputs.minGauge) : null,
        maxgauge: inputs.maxGauge !== null ? Number(inputs.maxGauge) : null,
        minspacing: inputs.minSpacing !== null ? Number(inputs.minSpacing) : null,
        maxspacing: inputs.maxSpacing !== null ? Number(inputs.maxSpacing) : null,
        lhTileWidth: Number(inputs.lhTileWidth),
        crossbonded: inputs.crossBonded,
      };
      console.log('Saving custom tile with payload:', payload);
      const response = await api.post('/api/users/tiles', payload);
      console.log('Server response:', response.data);
      const newTile: Tile = { ...response.data, isPersonal: true };
      setTiles((prevTiles) => {
        const updatedTiles = [...prevTiles, newTile];
        updatedTiles.sort((a: Tile, b: Tile) => {
          const typeA = a.type.toLowerCase();
          const typeB = b.type.toLowerCase();
          if (typeA < typeB) return -1;
          if (typeA > typeB) return 1;
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
        });
        return updatedTiles;
      });
      setSelectedTile(newTile);
      setInputs((prevInputs) => ({
        ...prevInputs,
        tileSelection: newTile.id.toString(),
      }));
      setError(null);
      setStepErrors([]);
      alert('Custom tile saved successfully!');
    } catch (err: any) {
      console.error('Error saving custom tile:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to save custom tile');
    }
  };

  const handleNext = async () => {
    if (!validateStep(activeStep)) return;

    if (activeStep === 0 && user.subscription === 'pro' && !inputs.tileSelection) {
      await handleSaveCustomTile();
      if (error) return; // Stop if save failed
    }

    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setStepErrors([]);
  };

  const calculateRoof = () => {
    setError(null);
    setResults(null);

    try {
      const verticalInputs = {
        rafterHeights: inputs.rafterHeights,
        gutterOverhang: inputs.gutterOverhang,
        materialType: inputs.materialType,
        slateTileHeight: inputs.slateTileHeight,
        maxGauge: inputs.maxGauge ?? 325,
        minGauge: inputs.minGauge ?? 75,
        useDryRidge: inputs.useDryRidge,
      };
      const horizontalInputs = {
        widths: inputs.widths,
        tileCoverWidth: inputs.tileCoverWidth,
        minSpacing: inputs.minSpacing ?? 3,
        maxSpacing: inputs.maxSpacing ?? 7,
        useDryVerge: (inputs.leftVergeType === 'Dry' || inputs.rightVergeType === 'Dry' ? 'YES' : 'NO') as 'YES' | 'NO',
        abutmentSide: (inputs.leftVergeType === 'Abutment' && inputs.rightVergeType === 'Abutment' ? 'BOTH' :
                       inputs.leftVergeType === 'Abutment' ? 'LEFT' :
                       inputs.rightVergeType === 'Abutment' ? 'RIGHT' : 'NONE') as 'NONE' | 'LEFT' | 'RIGHT' | 'BOTH',
        useLHTile: inputs.useLHTile,
        lhTileWidth: inputs.lhTileWidth,
        crossBonded: inputs.crossBonded,
      };

      const verticalResult = calculateVertical(verticalInputs);
      const horizontalResult = calculateHorizontal(horizontalInputs);

      const totalCourses = verticalResult.solution.type === 'full'
        ? verticalResult.solution.rafterResults[0].fullCourses! + 1
        : verticalResult.solution.type === 'split'
        ? verticalResult.solution.n_spaces
        : verticalResult.solution.n_spaces;

      const tilesPerCourse = horizontalResult.solution.type === 'split'
        ? horizontalResult.tilesWide
        : horizontalResult.tilesWide;

      const halfTiles = inputs.crossBonded === 'YES' ? Math.ceil(totalCourses / 2) : 0;
      const totalTiles = tilesPerCourse * totalCourses + halfTiles;

      setResults({
        vertical: verticalResult,
        horizontal: horizontalResult,
        totalCourses,
        totalTiles,
        halfTiles,
      });
      setActiveStep(3);
      setTileDataExpandedResults(true);
      setSettingsExpandedResults(true);
    } catch (err: any) {
      setError(err.message || 'Calculation failed');
    }
  };

  const handleRecalculate = () => {
    setInputs({
      tileSelection: '',
      tileName: '',
      rafterHeights: [0],
      rafterHeightNames: ['Rafter 1'],
      widths: [0],
      widthNames: ['Width 1'],
      gutterOverhang: 50,
      materialType: '',
      slateTileHeight: 0,
      tileCoverWidth: 0,
      minGauge: 75,
      maxGauge: 325,
      minSpacing: 3,
      maxSpacing: 7,
      useDryRidge: 'NO',
      leftVergeType: 'Wet',
      rightVergeType: 'Wet',
      useLHTile: 'NO',
      lhTileWidth: 0,
      crossBonded: 'NO',
    });
    setSelectedTile(null);
    setIsTileDataExpanded(true);
    setVerticalExpanded(false);
    setHorizontalExpanded(false);
    setResults(null);
    setError(null);
    setStepErrors([]);
    setProjectName('');
    setActiveStep(0);
    setTileDataExpandedResults(false);
    setSettingsExpandedResults(false);
  };

  const handleSaveResults = async () => {
    if (!projectName) {
      setError('Please enter a project name.');
      return;
    }
    try {
      const response = await api.post('/api/projects', {
        projectName,
        rafterHeights: inputs.rafterHeights,
        widths: inputs.widths,
        settings: {
          useDryRidge: inputs.useDryRidge,
          leftVergeType: inputs.leftVergeType,
          rightVergeType: inputs.rightVergeType,
          useLHTile: inputs.useLHTile,
          lhTileWidth: inputs.lhTileWidth,
          gutterOverhang: inputs.gutterOverhang,
        },
        materialType: inputs.materialType,
        slateTileHeight: inputs.slateTileHeight,
        tileCoverWidth: inputs.tileCoverWidth,
        minGauge: inputs.minGauge,
        maxGauge: inputs.maxGauge,
        minSpacing: inputs.minSpacing,
        maxSpacing: inputs.maxSpacing,
        crossBonded: inputs.crossBonded,
        verticalResults: results?.vertical,
        horizontalResults: results?.horizontal,
        totalResults: results?.totalCourses ? {
          totalCourses: results.totalCourses,
          totalTiles: results.totalTiles,
          halfTiles: results.halfTiles,
        } : null,
      });
      alert('Project saved successfully!');
      setProjectName('');
      setError(null);
    } catch (err) {
      setError('Failed to save project. Please try again.');
    }
  };

  const steps = user.subscription === 'pro'
    ? ['Choose Tile', 'Roof Dimensions', 'Settings', 'Results']
    : ['Tile Data', 'Roof Dimensions', 'Settings', 'Results'];

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
          pb: { xs: '160px', md: '180px' },
          minHeight: 'calc(100vh - 128px)',
          px: { xs: 1, sm: 2 },
        }}
      >
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
          Roofing Calculator
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4, flexWrap: 'wrap' }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} role="alert" id="calculator-error">
            {error}
          </Alert>
        )}
        {stepErrors.length > 0 && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {stepErrors.map((err, idx) => (
              <div key={idx}>{err}</div>
            ))}
          </Alert>
        )}
        {activeStep === 0 && (
          <Box sx={{ mb: 4 }}>
            {user.subscription === 'pro' && (
              <>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                  Choose Tile
                </Typography>
                <Autocomplete
                  options={tiles}
                  getOptionLabel={(option) => (option.isPersonal ? `Personal: ${option.name}` : option.name)}
                  groupBy={(option) => option.type}
                  value={selectedTile}
                  onChange={handleTileSelect}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Tile" variant="outlined" fullWidth />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      {option.isPersonal ? `Personal: ${option.name}` : option.name}
                    </li>
                  )}
                  sx={{ mb: 2 }}
                />
              </>
            )}
            <Accordion
              expanded={isTileDataExpanded}
              onChange={(event, expanded) => setIsTileDataExpanded(expanded)}
              sx={{ mt: user.subscription === 'pro' ? 2 : 0 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                  {user.subscription === 'pro' && selectedTile === null ? 'Input Custom Tile' : 'Tile Data'}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="Tile Name"
                      value={inputs.tileName}
                      onChange={(e) => setInputs({ ...inputs, tileName: e.target.value })}
                      fullWidth
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Select the type of material">
                      <FormControl fullWidth>
                        <InputLabel id="material-type-label">Material Type</InputLabel>
                        <Select
                          labelId="material-type-label"
                          value={inputs.materialType}
                          label="Material Type"
                          onChange={(e: SelectChangeEvent<string>) => setInputs({ ...inputs, materialType: e.target.value })}
                        >
                          <MenuItem value="Slate">Slate</MenuItem>
                          <MenuItem value="Tile">Tile</MenuItem>
                          <MenuItem value="Fibre Cement Slate">Fibre Cement Slate</MenuItem>
                          <MenuItem value="Plain Tile">Plain Tile</MenuItem>
                        </Select>
                      </FormControl>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Enter the length of the tile in millimeters (vertical dimension)">
                      <TextField
                        label="Tile Length (mm)"
                        type="number"
                        value={inputs.slateTileHeight}
                        onChange={(e) => setInputs({ ...inputs, slateTileHeight: Number(e.target.value) })}
                        fullWidth
                        required
                        inputProps={{ min: 0 }}
                        variant="outlined"
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Enter the width of the tile in millimeters (horizontal dimension)">
                      <TextField
                        label="Tile Width (mm)"
                        type="number"
                        value={inputs.tileCoverWidth}
                        onChange={(e) => setInputs({ ...inputs, tileCoverWidth: Number(e.target.value) })}
                        fullWidth
                        required
                        inputProps={{ min: 0 }}
                        variant="outlined"
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Enter the minimum batten spacing in millimeters (optional)">
                      <TextField
                        label="Min Gauge (mm)"
                        type="number"
                        value={inputs.minGauge ?? ''}
                        onChange={(e) => setInputs({ ...inputs, minGauge: e.target.value ? Number(e.target.value) : null })}
                        fullWidth
                        inputProps={{ min: 0 }}
                        variant="outlined"
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Enter the maximum batten spacing in millimeters (optional)">
                      <TextField
                        label="Max Gauge (mm)"
                        type="number"
                        value={inputs.maxGauge ?? ''}
                        onChange={(e) => setInputs({ ...inputs, maxGauge: e.target.value ? Number(e.target.value) : null })}
                        fullWidth
                        inputProps={{ min: 0 }}
                        variant="outlined"
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Enter the minimum horizontal spacing between tiles in millimeters (optional)">
                      <TextField
                        label="Min Spacing (mm)"
                        type="number"
                        value={inputs.minSpacing ?? ''}
                        onChange={(e) => setInputs({ ...inputs, minSpacing: e.target.value ? Number(e.target.value) : null })}
                        fullWidth
                        inputProps={{ min: 0 }}
                        variant="outlined"
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Enter the maximum horizontal spacing between tiles in millimeters (optional)">
                      <TextField
                        label="Max Spacing (mm)"
                        type="number"
                        value={inputs.maxSpacing ?? ''}
                        onChange={(e) => setInputs({ ...inputs, maxSpacing: e.target.value ? Number(e.target.value) : null })}
                        fullWidth
                        inputProps={{ min: 0 }}
                        variant="outlined"
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Enter the width of the left-hand tile in millimeters">
                      <TextField
                        label="LH Tile Width (mm)"
                        type="number"
                        value={inputs.lhTileWidth}
                        onChange={(e) => setInputs({ ...inputs, lhTileWidth: Number(e.target.value) })}
                        fullWidth
                        inputProps={{ min: 0 }}
                        variant="outlined"
                        sx={{ input: { fontSize: { xs: '1rem', sm: '1.2rem' }, py: { xs: 1, sm: 1.5 } } }}
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Enable cross-bonding to stagger tiles for better stability">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={inputs.crossBonded === 'YES'}
                            onChange={(e) => setInputs({ ...inputs, crossBonded: e.target.checked ? 'YES' : 'NO' })}
                          />
                        }
                        label="Cross-Bonded"
                        sx={{ display: 'flex', alignItems: 'center' }}
                      />
                    </Tooltip>
                  </Grid>
                  {user.subscription === 'pro' && (
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveCustomTile}
                        sx={{ mt: 2, py: 1.5, fontSize: { xs: '1rem', sm: '1.2rem' }, width: { xs: '100%', sm: 'auto' } }}
                      >
                        Save Custom Tile
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
        {activeStep === 1 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', color: 'text.primary' }}>
              Roof Dimensions
            </Typography>
            <Accordion
              expanded={verticalExpanded}
              onChange={(event, expanded) => setVerticalExpanded(expanded)}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                  Vertical
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  {inputs.rafterHeights.map((height, index) => (
                    <Grid item xs={12} key={index}>
                      {user.subscription === 'pro' && (
                        <TextField
                          label={`Rafter ${index + 1} Name`}
                          value={inputs.rafterHeightNames[index]}
                          onChange={(e) => updateRafterHeightName(index, e.target.value)}
                          fullWidth
                          sx={{ mb: 2 }}
                          variant="outlined"
                        />
                      )}
                      <Tooltip title="Enter the vertical height of the rafter in millimeters">
                        <TextField
                          label={`Rafter Height ${index + 1} (mm)`}
                          type="number"
                          value={height}
                          onChange={(e) => updateRafterHeight(index, e.target.value)}
                          fullWidth
                          inputProps={{ min: 0 }}
                          variant="outlined"
                          sx={{ input: { fontSize: { xs: '1rem', sm: '1.2rem' }, py: { xs: 1, sm: 1.5 } } }}
                        />
                      </Tooltip>
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Button
                      onClick={addRafterHeight}
                      variant="outlined"
                      color="primary"
                      sx={{ mt: 1, py: { xs: 1, sm: 1.5 }, fontSize: { xs: '0.9rem', sm: '1rem' }, width: { xs: '100%', sm: 'auto' } }}
                    >
                      Add Another Rafter Height
                    </Button>
                  </Grid>
                  {inputs.rafterHeights.some(h => h > 0) && (
                    <Grid item xs={12} sm={6}>
                      <Tooltip title="Enter the overhang at the gutter in millimeters (default is 50mm)">
                        <TextField
                          label="Gutter Overhang (mm)"
                          type="number"
                          value={inputs.gutterOverhang}
                          onChange={(e) => setInputs({ ...inputs, gutterOverhang: Number(e.target.value) })}
                          fullWidth
                          required
                          inputProps={{ min: 0 }}
                          variant="outlined"
                          sx={{ input: { fontSize: { xs: '1rem', sm: '1.2rem' }, py: { xs: 1, sm: 1.5 } } }}
                        />
                      </Tooltip>
                    </Grid>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={horizontalExpanded}
              onChange={(event, expanded) => setHorizontalExpanded(expanded)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                  Horizontal
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  {inputs.widths.map((width, index) => (
                    <Grid item xs={12} key={index}>
                      {user.subscription === 'pro' && (
                        <TextField
                          label={`Width ${index + 1} Name`}
                          value={inputs.widthNames[index]}
                          onChange={(e) => updateWidthName(index, e.target.value)}
                          fullWidth
                          sx={{ mb: 2 }}
                          variant="outlined"
                        />
                      )}
                      <Tooltip title="Enter the horizontal width of the roof section in millimeters">
                        <TextField
                          label={`Width ${index + 1} (mm)`}
                          type="number"
                          value={width}
                          onChange={(e) => updateWidth(index, e.target.value)}
                          fullWidth
                          inputProps={{ min: 0 }}
                          variant="outlined"
                          sx={{ input: { fontSize: { xs: '1rem', sm: '1.2rem' }, py: { xs: 1, sm: 1.5 } } }}
                        />
                      </Tooltip>
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Button
                      onClick={addWidth}
                      variant="outlined"
                      color="primary"
                      sx={{ mt: 1, py: { xs: 1, sm: 1.5 }, fontSize: { xs: '0.9rem', sm: '1rem' }, width: { xs: '100%', sm: 'auto' } }}
                    >
                      Add Another Width
                    </Button>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
        {activeStep === 2 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', color: 'text.primary' }}>
              Settings
            </Typography>
            <Grid container spacing={3}>
              {(inputs.rafterHeights.some(h => h > 0) || inputs.widths.some(w => w > 0)) && (
                <>
                  {inputs.rafterHeights.some(h => h > 0) && (
                    <Grid item xs={12} sm={6}>
                      <Tooltip title="Select the type of ridge system">
                        <FormControl fullWidth>
                          <InputLabel id="use-dry-ridge-label">Ridge Type</InputLabel>
                          <Select
                            labelId="use-dry-ridge-label"
                            value={inputs.useDryRidge}
                            label="Ridge Type"
                            onChange={(e: SelectChangeEvent<'YES' | 'NO'>) => setInputs({ ...inputs, useDryRidge: e.target.value as 'YES' | 'NO' })}
                            sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, py: { xs: 0.5, sm: 0.5 } }}
                          >
                            <MenuItem value="YES">Dry Ridge</MenuItem>
                            <MenuItem value="NO">Wet Ridge</MenuItem>
                          </Select>
                        </FormControl>
                      </Tooltip>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Select the type of left verge">
                      <FormControl fullWidth>
                        <InputLabel id="left-verge-type-label">Left Verge Type</InputLabel>
                        <Select
                          labelId="left-verge-type-label"
                          value={inputs.leftVergeType}
                          label="Left Verge Type"
                          onChange={(e: SelectChangeEvent<'Wet' | 'Dry' | 'Abutment'>) => setInputs({ ...inputs, leftVergeType: e.target.value as 'Wet' | 'Dry' | 'Abutment' })}
                          sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, py: { xs: 0.5, sm: 0.5 } }}
                        >
                          <MenuItem value="Wet">Wet Verge</MenuItem>
                          <MenuItem value="Dry">Dry Verge</MenuItem>
                          <MenuItem value="Abutment">Abutment</MenuItem>
                        </Select>
                      </FormControl>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Select the type of right verge">
                      <FormControl fullWidth>
                        <InputLabel id="right-verge-type-label">Right Verge Type</InputLabel>
                        <Select
                          labelId="right-verge-type-label"
                          value={inputs.rightVergeType}
                          label="Right Verge Type"
                          onChange={(e: SelectChangeEvent<'Wet' | 'Dry' | 'Abutment'>) => setInputs({ ...inputs, rightVergeType: e.target.value as 'Wet' | 'Dry' | 'Abutment' })}
                          sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, py: { xs: 0.5, sm: 0.5 } }}
                        >
                          <MenuItem value="Wet">Wet Verge</MenuItem>
                          <MenuItem value="Dry">Dry Verge</MenuItem>
                          <MenuItem value="Abutment">Abutment</MenuItem>
                        </Select>
                      </FormControl>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Indicate if a left-hand tile is used">
                      <FormControl fullWidth>
                        <InputLabel id="use-lh-tile-label">Use LH Tile</InputLabel>
                        <Select
                          labelId="use-lh-tile-label"
                          value={inputs.useLHTile}
                          label="Use LH Tile"
                          onChange={(e: SelectChangeEvent<'YES' | 'NO'>) => setInputs({ ...inputs, useLHTile: e.target.value as 'YES' | 'NO' })}
                          disabled={inputs.leftVergeType === 'Abutment' || inputs.rightVergeType === 'Abutment'}
                          sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, py: { xs: 0.5, sm: 0.5 } }}
                        >
                          <MenuItem value="YES">Yes</MenuItem>
                          <MenuItem value="NO">No</MenuItem>
                        </Select>
                      </FormControl>
                    </Tooltip>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        )}
        {activeStep === 3 && (
          <Box>
            {!results ? (
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={calculateRoof}
                  sx={{ py: { xs: 1, sm: 1.5 }, fontSize: { xs: '1rem', sm: '1.2rem' }, minWidth: { xs: 180, sm: 200 } }}
                >
                  Calculate Roof
                </Button>
              </Box>
            ) : (
              <Paper sx={{ mt: 5, p: { xs: 1, sm: 2, md: 3 }, borderRadius: 2, boxShadow: 2 }}>
                <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                  Calculation Results
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Accordion expanded={tileDataExpandedResults} onChange={(event, expanded) => setTileDataExpandedResults(expanded)}>
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
                                  {inputs.materialType}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Tile Length</TableCell>
                                <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                  {inputs.slateTileHeight} mm
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Tile Width</TableCell>
                                <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                  {inputs.tileCoverWidth} mm
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Min Gauge</TableCell>
                                <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                  {inputs.minGauge ?? 75} mm
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Max Gauge</TableCell>
                                <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                  {inputs.maxGauge ?? 325} mm
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Min Spacing</TableCell>
                                <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                  {inputs.minSpacing ?? 3} mm
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Max Spacing</TableCell>
                                <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                  {inputs.maxSpacing ?? 7} mm
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Cross-Bonded</TableCell>
                                <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                  {inputs.crossBonded}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Accordion expanded={settingsExpandedResults} onChange={(event, expanded) => setSettingsExpandedResults(expanded)}>
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
                                  {inputs.leftVergeType}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Right Verge</TableCell>
                                <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                  {inputs.rightVergeType}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Use LH Tile</TableCell>
                                <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                  {inputs.useLHTile}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Gutter Overhang</TableCell>
                                <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                  {inputs.gutterOverhang} mm
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Use Dry Ridge</TableCell>
                                <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                  {inputs.useDryRidge}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                </Grid>
                {results.vertical && results.vertical.solution.rafterResults && (
                  <Accordion sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'text.primary', fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                        Vertical Results
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {results.vertical.solution.rafterResults.map((r: any, index: number) => (
                        inputs.rafterHeights[index] > 0 && (
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
                                    {inputs.useDryRidge === 'YES' && (
                                      <TableRow>
                                        <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>Under Eave Batten</TableCell>
                                        <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                          {results.vertical.underEaveBatten} mm
                                        </TableCell>
                                      </TableRow>
                                    )}
                                    {['Slate', 'Fibre Cement Slate', 'Plain Tile'].includes(inputs.materialType) && (
                                      <TableRow>
                                        <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>Eave Batten</TableCell>
                                        <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                          {results.vertical.eaveBatten} mm
                                        </TableCell>
                                      </TableRow>
                                    )}
                                    <TableRow>
                                      <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>1st Batten</TableCell>
                                      <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                        {results.vertical.firstBatten} mm
                                      </TableCell>
                                    </TableRow>
                                    {results.vertical.solution.type === 'full' && (
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
                                            {results.vertical.firstBatten + (results.vertical.solution.n_spaces - 1) * (r.battenGauge || 0) + r.effectiveRidgeOffset} mm
                                          </TableCell>
                                        </TableRow>
                                      </>
                                    )}
                                    {results.vertical.solution.type === 'split' && (
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
                                            {results.vertical.firstBatten + (results.vertical.solution.n1! * (r.gauge1 || 0) + results.vertical.solution.n2! * (r.gauge2 || 0)) + r.effectiveRidgeOffset} mm
                                          </TableCell>
                                        </TableRow>
                                      </>
                                    )}
                                    {results.vertical.solution.type === 'cut' && (
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
                                            {r.fullCourses} @ {inputs.maxGauge ?? 325} mm
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
                                            {results.vertical.firstBatten + (r.cutCourseGauge || 0) + (r.fullCourses || 0) * (inputs.maxGauge ?? 325) + r.effectiveRidgeOffset} mm
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
                {results.horizontal && results.horizontal.solution.widthResults && (
                  <Accordion sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'text.primary', fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                        Horizontal Results
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {results.horizontal.solution.widthResults.map((r: any, index: number) => (
                        inputs.widths[index] > 0 && (
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
                                        {inputs.widths[index]} mm
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>Final Width</TableCell>
                                      <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                        {inputs.widths[index] + r.overhangLeft + r.overhangRight} mm
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>Total Tiles Wide</TableCell>
                                      <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                        {results.horizontal.tilesWide}
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
                                *measure from LH brickwork, Marks In sets of {results.horizontal.setSize}
                              </Typography>
                            </AccordionDetails>
                          </Accordion>
                        )
                      ))}
                    </AccordionDetails>
                  </Accordion>
                )}
                {results.totalCourses && (
                  <Accordion sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'text.primary', fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                        Total Results
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ overflowX: 'auto' }}>
                        <Table sx={{ minWidth: 500, backgroundColor: 'primary.main', color: 'white' }}>
                          <TableBody>
                            <TableRow>
                              <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>Total Courses</TableCell>
                              <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                {results.totalCourses}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>Total Tiles</TableCell>
                              <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                {results.totalTiles}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'white' }}>Half Tiles</TableCell>
                              <TableCell sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 'bold', color: 'white' }}>
                                {results.halfTiles}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                )}
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <TextField
                    label="Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    sx={{ mb: 2, width: { xs: '100%', sm: 300 } }}
                    variant="outlined"
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSaveResults}
                      sx={{ py: { xs: 1, sm: 1.5 }, fontSize: { xs: '1rem', sm: '1.2rem' }, minWidth: { xs: 180, sm: 200 } }}
                    >
                      Save Results
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleRecalculate}
                      sx={{ py: { xs: 1, sm: 1.5 }, fontSize: { xs: '1rem', sm: '1.2rem' }, minWidth: { xs: 180, sm: 200 } }}
                    >
                      Recalculate
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleBack}
                      sx={{ py: { xs: 1, sm: 1.5 }, fontSize: { xs: '1rem', sm: '1.2rem' }, minWidth: { xs: 180, sm: 200 } }}
                    >
                      Back
                    </Button>
                  </Box>
                </Box>
              </Paper>
            )}
          </Box>
        )}
        {activeStep < 3 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleBack}
              disabled={activeStep === 0}
              sx={{ py: { xs: 1, sm: 1.5 }, fontSize: { xs: '1rem', sm: '1.2rem' }, minWidth: { xs: 120, sm: 150 } }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              sx={{ py: { xs: 1, sm: 1.5 }, fontSize: { xs: '1rem', sm: '1.2rem' }, minWidth: { xs: 120, sm: 150 } }}
            >
              Next
            </Button>
          </Box>
        )}
      </Box>
      <Footer />
    </Box>
  );
};

export default Calculator;