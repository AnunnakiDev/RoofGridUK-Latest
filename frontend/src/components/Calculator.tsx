import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Select,
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

interface Tile {
  id: number;
  name: string;
  type: string;
  length: number;
  width: number;
  eave_tile_length: number | null;
  headlap: number | null;
  crossbonded: string;
  mingauge: number;
  maxgauge: number;
  minspacing: number;
  maxspacing: number;
  datasheet_link: string | null;
  lhTileWidth: number;
  isPersonal?: boolean;
}

interface FormInputs {
  tileSelection: string;
  tileName: string;
  rafterHeights: number[];
  widths: number[];
  gutterOverhang: number;
  materialType: string;
  slateTileHeight: number;
  tileCoverWidth: number;
  minGauge: number;
  maxGauge: number;
  minSpacing: number;
  maxSpacing: number;
  useDryRidge: 'YES' | 'NO';
  leftVergeType: 'Wet' | 'Dry' | 'Abutment';
  rightVergeType: 'Wet' | 'Dry' | 'Abutment';
  useLHTile: 'YES' | 'NO';
  lhTileWidth: number;
  crossBonded: 'YES' | 'NO';
}

const Calculator: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [isCustomTile, setIsCustomTile] = useState(false);
  const [verticalExpanded, setVerticalExpanded] = useState(false);
  const [horizontalExpanded, setHorizontalExpanded] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [inputs, setInputs] = useState<FormInputs>({
    tileSelection: '',
    tileName: '',
    rafterHeights: [0],
    widths: [0],
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

  // Fetch tiles for pro users
  useEffect(() => {
    const fetchTiles = async () => {
      try {
        const defaultTilesResponse = await api.get('/api/tiles');
        const defaultTiles = defaultTilesResponse.data.map((tile: Tile) => ({ ...tile, isPersonal: false }));
        const tilesList = [...defaultTiles];

        // Fetch personal tiles for pro users
        if (user.subscription === 'pro') {
          const personalTilesResponse = await api.get('/api/users/tiles');
          const personalTiles = personalTilesResponse.data.map((tile: Tile) => ({ ...tile, isPersonal: true }));
          tilesList.push(...personalTiles);
        }

        setTiles(tilesList);
      } catch (err) {
        console.error('Error fetching tiles:', err);
        setError('Failed to fetch tiles');
      }
    };

    if (user.subscription === 'pro') {
      fetchTiles();
    }
  }, [user.subscription]);

  // Auto-collapse Vertical section if all rafter heights are 0
  useEffect(() => {
    if (!inputs.rafterHeights.some(h => h > 0)) {
      setVerticalExpanded(false);
    }
  }, [inputs.rafterHeights]);

  // Auto-collapse Horizontal section if all widths are 0
  useEffect(() => {
    if (!inputs.widths.some(w => w > 0)) {
      setHorizontalExpanded(false);
    }
  }, [inputs.widths]);

  const handleTileSelect = (tileId: string) => {
    if (tileId === 'custom') {
      setIsCustomTile(true);
      setSelectedTile(null);
      setInputs({
        ...inputs,
        tileSelection: 'custom',
        tileName: 'Custom Tile',
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
    } else {
      const tile = tiles.find(t => t.id === Number(tileId));
      if (tile) {
        setSelectedTile(tile);
        setIsCustomTile(false);
        let materialType: string;
        switch (tile.type.toLowerCase()) {
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
            materialType = tile.type;
        }
        setInputs({
          ...inputs,
          tileSelection: tileId,
          tileName: tile.name,
          materialType,
          slateTileHeight: tile.length,
          tileCoverWidth: tile.width,
          minGauge: tile.mingauge,
          maxGauge: tile.maxgauge,
          minSpacing: tile.minspacing,
          maxSpacing: tile.maxspacing,
          lhTileWidth: tile.lhTileWidth || 0,
          crossBonded: tile.crossbonded as 'YES' | 'NO',
        });
      }
    }
  };

  const addRafterHeight = () => {
    setInputs({ ...inputs, rafterHeights: [...inputs.rafterHeights, 0] });
  };

  const updateRafterHeight = (index: number, value: string) => {
    const newRafterHeights = [...inputs.rafterHeights];
    newRafterHeights[index] = value ? Number(value) : 0;
    setInputs({ ...inputs, rafterHeights: newRafterHeights });
  };

  const addWidth = () => {
    setInputs({ ...inputs, widths: [...inputs.widths, 0] });
  };

  const updateWidth = (index: number, value: string) => {
    const newWidths = [...inputs.widths];
    newWidths[index] = value ? Number(value) : 0;
    setInputs({ ...inputs, widths: newWidths });
  };

  const validateStep = (step: number): boolean => {
    const errors: string[] = [];

    if (step === 0) {
      if (user.subscription === 'pro' && !inputs.tileSelection) {
        errors.push('Please select a tile.');
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
      if (inputs.minGauge <= 0) {
        errors.push('Min Gauge must be greater than 0.');
      }
      if (inputs.maxGauge <= 0) {
        errors.push('Max Gauge must be greater than 0.');
      }
      if (inputs.minGauge > inputs.maxGauge) {
        errors.push('Min Gauge must be less than or equal to Max Gauge.');
      }
      if (inputs.minSpacing <= 0) {
        errors.push('Min Spacing must be greater than 0.');
      }
      if (inputs.maxSpacing <= 0) {
        errors.push('Max Spacing must be greater than 0.');
      }
      if (inputs.minSpacing > inputs.maxSpacing) {
        errors.push('Min Spacing must be less than or equal to Max Spacing.');
      }
      if (inputs.lhTileWidth < 0) {
        errors.push('LH Tile Width must be 0 or greater.');
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

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
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
        maxGauge: inputs.maxGauge,
        minGauge: inputs.minGauge,
        useDryRidge: inputs.useDryRidge,
      };
      const horizontalInputs = {
        widths: inputs.widths,
        tileCoverWidth: inputs.tileCoverWidth,
        minSpacing: inputs.minSpacing,
        maxSpacing: inputs.maxSpacing,
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
    } catch (err: any) {
      setError(err.message || 'Calculation failed');
    }
  };

  const handleRecalculate = () => {
    setInputs({
      tileSelection: '',
      tileName: '',
      rafterHeights: [0],
      widths: [0],
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
    setIsCustomTile(false);
    setVerticalExpanded(false);
    setHorizontalExpanded(false);
    setResults(null);
    setError(null);
    setStepErrors([]);
    setProjectName('');
    setActiveStep(0);
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
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, p: { xs: 2, sm: 3 }, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
        Roofing Calculator
      </Typography>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
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
      {/* Step 1: Choose Tile / Tile Data */}
      {activeStep === 0 && (
        <Box sx={{ mb: 4 }}>
          {user.subscription === 'pro' && (
            <>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                Choose Tile
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="tile-select-label">Select Tile</InputLabel>
                <Select
                  labelId="tile-select-label"
                  value={inputs.tileSelection}
                  label="Select Tile"
                  onChange={(e) => handleTileSelect(e.target.value as string)}
                >
                  <MenuItem value="">Select a tile</MenuItem>
                  {tiles.map(tile => (
                    <MenuItem key={tile.id} value={tile.id}>
                      {tile.isPersonal ? `Personal: ${tile.name}` : tile.name}
                    </MenuItem>
                  ))}
                  <MenuItem value="custom">Custom Tile</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
          <Accordion
            expanded={user.subscription === 'free' || (user.subscription === 'pro' && !!inputs.tileSelection)}
            sx={{ mt: user.subscription === 'pro' ? 2 : 0 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                Tile Data
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Tooltip title="Select the type of material">
                    <FormControl fullWidth>
                      <InputLabel id="material-type-label">Material Type</InputLabel>
                      <Select
                        labelId="material-type-label"
                        value={inputs.materialType}
                        label="Material Type"
                        onChange={(e) => setInputs({ ...inputs, materialType: e.target.value })}
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
                  <Tooltip title="Enter the minimum batten spacing in millimeters">
                    <TextField
                      label="Min Gauge (mm)"
                      type="number"
                      value={inputs.minGauge}
                      onChange={(e) => setInputs({ ...inputs, minGauge: Number(e.target.value) })}
                      fullWidth
                      required
                      inputProps={{ min: 0 }}
                      variant="outlined"
                    />
                  </Tooltip>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Tooltip title="Enter the maximum batten spacing in millimeters">
                    <TextField
                      label="Max Gauge (mm)"
                      type="number"
                      value={inputs.maxGauge}
                      onChange={(e) => setInputs({ ...inputs, maxGauge: Number(e.target.value) })}
                      fullWidth
                      required
                      inputProps={{ min: 0 }}
                      variant="outlined"
                    />
                  </Tooltip>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Tooltip title="Enter the minimum horizontal spacing between tiles in millimeters">
                    <TextField
                      label="Min Spacing (mm)"
                      type="number"
                      value={inputs.minSpacing}
                      onChange={(e) => setInputs({ ...inputs, minSpacing: Number(e.target.value) })}
                      fullWidth
                      required
                      inputProps={{ min: 0 }}
                      variant="outlined"
                    />
                  </Tooltip>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Tooltip title="Enter the maximum horizontal spacing between tiles in millimeters">
                    <TextField
                      label="Max Spacing (mm)"
                      type="number"
                      value={inputs.maxSpacing}
                      onChange={(e) => setInputs({ ...inputs, maxSpacing: Number(e.target.value) })}
                      fullWidth
                      required
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
                      sx={{ input: { fontSize: '1.2rem', py: 1.5 } }}
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
                    />
                  </Tooltip>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
      {/* Step 2: Roof Dimensions */}
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
                  <Grid item xs={12} sm={6} key={index}>
                    <Tooltip title="Enter the vertical height of the rafter in millimeters">
                      <TextField
                        label={`Rafter Height ${index + 1} (mm)`}
                        type="number"
                        value={height}
                        onChange={(e) => updateRafterHeight(index, e.target.value)}
                        fullWidth
                        inputProps={{ min: 0 }}
                        variant="outlined"
                        sx={{ input: { fontSize: '1.2rem', py: 1.5 } }}
                      />
                    </Tooltip>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Button onClick={addRafterHeight} variant="outlined" color="primary" sx={{ mt: 1, py: 1.5, fontSize: '1rem' }}>
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
                        sx={{ input: { fontSize: '1.2rem', py: 1.5 } }}
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
                  <Grid item xs={12} sm={6} key={index}>
                    <Tooltip title="Enter the horizontal width of the roof section in millimeters">
                      <TextField
                        label={`Width ${index + 1} (mm)`}
                        type="number"
                        value={width}
                        onChange={(e) => updateWidth(index, e.target.value)}
                        fullWidth
                        inputProps={{ min: 0 }}
                        variant="outlined"
                        sx={{ input: { fontSize: '1.2rem', py: 1.5 } }}
                      />
                    </Tooltip>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Button onClick={addWidth} variant="outlined" color="primary" sx={{ mt: 1, py: 1.5, fontSize: '1rem' }}>
                    Add Another Width
                  </Button>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
      {/* Step 3: Settings */}
      {activeStep === 2 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', color: 'text.primary' }}>
            Settings
          </Typography>
          <Grid container spacing={3}>
            {inputs.rafterHeights.some(h => h > 0) && (
              <Grid item xs={12} sm={6}>
                <Tooltip title="Select the type of ridge system">
                  <FormControl fullWidth>
                    <InputLabel id="use-dry-ridge-label">Ridge Type</InputLabel>
                    <Select
                      labelId="use-dry-ridge-label"
                      value={inputs.useDryRidge}
                      label="Ridge Type"
                      onChange={(e) => setInputs({ ...inputs, useDryRidge: e.target.value as 'YES' | 'NO' })}
                      sx={{ fontSize: '1.2rem', py: 0.5 }}
                    >
                      <MenuItem value="YES">Dry Ridge</MenuItem>
                      <MenuItem value="NO">Wet Ridge</MenuItem>
                    </Select>
                  </FormControl>
                </Tooltip>
              </Grid>
            )}
            {inputs.widths.some(w => w > 0) && (
              <>
                <Grid item xs={12} sm={6}>
                  <Tooltip title="Select the type of left verge">
                    <FormControl fullWidth>
                      <InputLabel id="left-verge-type-label">Left Verge Type</InputLabel>
                      <Select
                        labelId="left-verge-type-label"
                        value={inputs.leftVergeType}
                        label="Left Verge Type"
                        onChange={(e) => setInputs({ ...inputs, leftVergeType: e.target.value as 'Wet' | 'Dry' | 'Abutment' })}
                        sx={{ fontSize: '1.2rem', py: 0.5 }}
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
                        onChange={(e) => setInputs({ ...inputs, rightVergeType: e.target.value as 'Wet' | 'Dry' | 'Abutment' })}
                        sx={{ fontSize: '1.2rem', py: 0.5 }}
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
                        onChange={(e) => setInputs({ ...inputs, useLHTile: e.target.value as 'YES' | 'NO' })}
                        disabled={inputs.leftVergeType === 'Abutment' || inputs.rightVergeType === 'Abutment'}
                        sx={{ fontSize: '1.2rem', py: 0.5 }}
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
      {/* Step 4: Results */}
      {activeStep === 3 && (
        <Box>
          {!results ? (
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={calculateRoof}
                sx={{ py: 1.5, fontSize: '1.2rem', minWidth: 200 }}
              >
                Calculate Roof
              </Button>
            </Box>
          ) : (
            <Paper sx={{ mt: 5, p: { xs: 2, sm: 3 }, borderRadius: 2, boxShadow: 2 }}>
              <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
                Calculation Results
              </Typography>
              {/* Summary of Inputs */}
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h5" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                    Summary of Inputs
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 'medium' }}>
                    Tile
                  </Typography>
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    Tile Name: {inputs.tileName}
                  </Typography>
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    Material Type: {inputs.materialType}
                  </Typography>
                  {inputs.rafterHeights.some(h => h > 0) && (
                    <>
                      <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'medium' }}>
                        Vertical Inputs
                      </Typography>
                      {inputs.rafterHeights.map((height, index) => (
                        height > 0 && (
                          <Typography key={index} variant="body1" sx={{ ml: 2 }}>
                            Rafter {index + 1}: {height} mm
                          </Typography>
                        )
                      ))}
                      <Typography variant="body1" sx={{ ml: 2, mt: 1 }}>
                        Gutter Overhang: {inputs.gutterOverhang} mm
                      </Typography>
                    </>
                  )}
                  {inputs.widths.some(w => w > 0) && (
                    <>
                      <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'medium' }}>
                        Horizontal Inputs
                      </Typography>
                      {inputs.widths.map((width, index) => (
                        width > 0 && (
                          <Typography key={index} variant="body1" sx={{ ml: 2 }}>
                            Width {index + 1}: {width} mm
                          </Typography>
                        )
                      ))}
                    </>
                  )}
                  <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'medium' }}>
                    Settings
                  </Typography>
                  {inputs.rafterHeights.some(h => h > 0) && (
                    <Typography variant="body1" sx={{ ml: 2 }}>
                      Ridge Type: {inputs.useDryRidge === 'YES' ? 'Dry Ridge' : 'Wet Ridge'}
                    </Typography>
                  )}
                  {inputs.widths.some(w => w > 0) && (
                    <>
                      <Typography variant="body1" sx={{ ml: 2 }}>
                        Left Verge Type: {inputs.leftVergeType}
                      </Typography>
                      <Typography variant="body1" sx={{ ml: 2 }}>
                        Right Verge Type: {inputs.rightVergeType}
                      </Typography>
                      <Typography variant="body1" sx={{ ml: 2 }}>
                        Use LH Tile: {inputs.useLHTile}
                      </Typography>
                    </>
                  )}
                </AccordionDetails>
              </Accordion>
              {/* Vertical Results */}
              {inputs.rafterHeights.some(h => h > 0) && (
                <Accordion defaultExpanded sx={{ mt: 3 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                      Vertical Results
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ overflowX: 'auto' }}>
                      <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}></TableCell>
                            {inputs.rafterHeights.map((_, index) => (
                              <TableCell key={index} sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                                Rafter {index + 1}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ fontSize: '1.1rem' }}>Rafter Length</TableCell>
                            {inputs.rafterHeights.map((height, index) => (
                              <TableCell key={index} sx={{ fontSize: '1.1rem' }}>{height} mm</TableCell>
                            ))}
                          </TableRow>
                          {results!.vertical.underEaveBatten > 0 && (
                            <TableRow>
                              <TableCell sx={{ fontSize: '1.1rem' }}>Under Eave Batten</TableCell>
                              {inputs.rafterHeights.map((_, index) => (
                                <TableCell key={index} sx={{ fontSize: '1.1rem' }}>{results!.vertical.underEaveBatten} mm</TableCell>
                              ))}
                            </TableRow>
                          )}
                          <TableRow>
                            <TableCell sx={{ fontSize: '1.1rem' }}>Eave Batten</TableCell>
                            {inputs.rafterHeights.map((_, index) => (
                              <TableCell key={index} sx={{ fontSize: '1.1rem' }}>{results!.vertical.eaveBatten} mm</TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontSize: '1.1rem' }}>1st Batten</TableCell>
                            {inputs.rafterHeights.map((_, index) => (
                              <TableCell key={index} sx={{ fontSize: '1.1rem' }}>{results!.vertical.firstBatten} mm</TableCell>
                            ))}
                          </TableRow>
                          {results!.vertical.solution.type === 'full' && (
                            <>
                              <TableRow>
                                <TableCell sx={{ fontSize: '1.1rem' }}>Gauge</TableCell>
                                {results!.vertical.solution.rafterResults.map((r: RafterResult, index: number) => (
                                  <TableCell key={index} sx={{ fontSize: '1.1rem' }}>
                                    {(results!.vertical.solution.n_spaces - 1)}@{r.battenGauge} mm
                                  </TableCell>
                                ))}
                              </TableRow>
                            </>
                          )}
                          {results!.vertical.solution.type === 'split' && (
                            <>
                              <TableRow>
                                <TableCell sx={{ fontSize: '1.1rem' }}>Gauge</TableCell>
                                {results!.vertical.solution.rafterResults.map((r: RafterResult, index: number) => (
                                  <TableCell key={index} sx={{ fontSize: '1.1rem' }}>
                                    {results!.vertical.solution.n1}@{r.gauge1} mm
                                  </TableCell>
                                ))}
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ fontSize: '1.1rem' }}>2nd Gauge</TableCell>
                                {results!.vertical.solution.rafterResults.map((r: RafterResult, index: number) => (
                                  <TableCell key={index} sx={{ fontSize: '1.1rem' }}>
                                    {results!.vertical.solution.n2}@{r.gauge2} mm
                                  </TableCell>
                                ))}
                              </TableRow>
                            </>
                          )}
                          {results!.vertical.solution.type === 'cut' && (
                            <>
                              <TableRow>
                                <TableCell sx={{ fontSize: '1.1rem' }}>Cut Course Gauge</TableCell>
                                {results!.vertical.solution.rafterResults.map((r: RafterResult, index: number) => (
                                  <TableCell key={index} sx={{ fontSize: '1.1rem' }}>{r.cutCourseGauge} mm</TableCell>
                                ))}
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ fontSize: '1.1rem' }}>Gauge</TableCell>
                                {results!.vertical.solution.rafterResults.map((r: RafterResult, index: number) => (
                                  <TableCell key={index} sx={{ fontSize: '1.1rem' }}>
                                    {r.fullCourses}@{inputs.maxGauge} mm
                                  </TableCell>
                                ))}
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ fontSize: '1.1rem' }}>Message</TableCell>
                                <TableCell colSpan={inputs.rafterHeights.length} sx={{ fontSize: '1.1rem' }}>
                                  No full tile fit found even with split gauges, introduced a cut course above the 1st batten.
                                </TableCell>
                              </TableRow>
                            </>
                          )}
                          <TableRow>
                            <TableCell sx={{ fontSize: '1.1rem' }}>Ridge Offset</TableCell>
                            {results!.vertical.solution.rafterResults.map((r: RafterResult, index: number) => (
                              <TableCell key={index} sx={{ fontSize: '1.1rem' }}>{r.effectiveRidgeOffset} mm</TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontSize: '1.1rem' }}>Total</TableCell>
                            {results!.vertical.solution.rafterResults.map((r: RafterResult, index: number) => {
                              const total = results!.vertical.solution.type === 'full'
                                ? results!.vertical.firstBatten + (results!.vertical.solution.n_spaces - 1) * r.battenGauge! + r.effectiveRidgeOffset
                                : results!.vertical.solution.type === 'split'
                                ? results!.vertical.firstBatten + results!.vertical.solution.n1! * r.gauge1! + results!.vertical.solution.n2! * r.gauge2! + r.effectiveRidgeOffset
                                : results!.vertical.firstBatten + r.cutCourseGauge! + r.fullCourses! * inputs.maxGauge + r.effectiveRidgeOffset;
                              return <TableCell key={index} sx={{ fontSize: '1.1rem' }}>{total} mm</TableCell>;
                            })}
                          </TableRow>
                          {results!.vertical.warning && (
                            <TableRow>
                              <TableCell sx={{ color: 'error.main', fontSize: '1.1rem' }}>Warning</TableCell>
                              <TableCell colSpan={inputs.rafterHeights.length} sx={{ color: 'error.main', fontSize: '1.1rem' }}>
                                {results!.vertical.warning}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              )}
              {/* Horizontal Results */}
              {inputs.widths.some(w => w > 0) && (
                <Accordion defaultExpanded sx={{ mt: 3 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                      Horizontal Results
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ overflowX: 'auto' }}>
                      <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}></TableCell>
                            {inputs.widths.map((_, index) => (
                              <TableCell key={index} sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                                Width {index + 1}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ fontSize: '1.1rem' }}>Starting Width</TableCell>
                            {inputs.widths.map((width, index) => (
                              <TableCell key={index} sx={{ fontSize: '1.1rem' }}>{width} mm</TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontSize: '1.1rem' }}>Final Width</TableCell>
                            {results!.horizontal.solution.widthResults.map((r: WidthResult, index: number) => (
                              <TableCell key={index} sx={{ fontSize: '1.1rem' }}>{r.totalWidth} mm</TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontSize: '1.1rem' }}>Left Verge</TableCell>
                            {results!.horizontal.solution.widthResults.map((r: WidthResult, index: number) => (
                              <TableCell key={index} sx={{ fontSize: '1.1rem' }}>{r.overhangLeft} mm</TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontSize: '1.1rem' }}>Right Verge</TableCell>
                            {results!.horizontal.solution.widthResults.map((r: WidthResult, index: number) => (
                              <TableCell key={index} sx={{ fontSize: '1.1rem' }}>{r.overhangRight} mm</TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontSize: '1.1rem' }}>Total Tiles Wide</TableCell>
                            {results!.horizontal.solution.widthResults.map((_: WidthResult, index: number) => (
                              <TableCell key={index} sx={{ fontSize: '1.1rem' }}>{results!.horizontal.tilesWide}</TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontSize: '1.1rem' }}>1st Mark</TableCell>
                            {results!.horizontal.solution.widthResults.map((r: WidthResult, index: number) => (
                              <TableCell key={index} sx={{ fontSize: '1.1rem' }}>{r.firstMark} mm</TableCell>
                            ))}
                          </TableRow>
                          {results!.horizontal.solution.type === 'full' || results!.horizontal.solution.type === 'cut' ? (
                            <>
                              <TableRow>
                                <TableCell sx={{ fontSize: '1.1rem' }}>Marks</TableCell>
                                {results!.horizontal.solution.widthResults.map((r: WidthResult, index: number) => (
                                  <TableCell key={index} sx={{ fontSize: '1.1rem' }}>
                                    {r.totalSets}@{r.adjustedMarks} mm
                                  </TableCell>
                                ))}
                              </TableRow>
                              {results!.horizontal.solution.widthResults.some(r => (r.remainingTiles ?? 0) > 0) && (
                                <TableRow>
                                  <TableCell sx={{ fontSize: '1.1rem' }}>Remaining Tiles</TableCell>
                                  {results!.horizontal.solution.widthResults.map((r: WidthResult, index: number) => (
                                    <TableCell key={index} sx={{ fontSize: '1.1rem' }}>
                                      {(r.remainingTiles ?? 0) > 0 ? `${r.remainingTiles} at ${inputs.tileCoverWidth + (r.actualSpacing ?? 0)} mm` : ''}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              )}
                            </>
                          ) : (
                            <>
                              <TableRow>
                                <TableCell sx={{ fontSize: '1.1rem' }}>Marks</TableCell>
                                {results!.horizontal.solution.widthResults.map((r: WidthResult, index: number) => (
                                  <TableCell key={index} sx={{ fontSize: '1.1rem' }}>
                                    {r.sets1 ?? 0}@{r.adjustedMarks1 ?? 0} mm
                                  </TableCell>
                                ))}
                              </TableRow>
                              {results!.horizontal.solution.widthResults.some(r => (r.remainingTiles1 ?? 0) > 0) && (
                                <TableRow>
                                  <TableCell sx={{ fontSize: '1.1rem' }}>Remaining Tiles 1</TableCell>
                                  {results!.horizontal.solution.widthResults.map((r: WidthResult, index: number) => (
                                    <TableCell key={index} sx={{ fontSize: '1.1rem' }}>
                                      {(r.remainingTiles1 ?? 0) > 0 ? `${r.remainingTiles1} at ${inputs.tileCoverWidth + (r.spacing1 ?? 0)} mm` : ''}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              )}
                              <TableRow>
                                <TableCell sx={{ fontSize: '1.1rem' }}>2nd set of Marks</TableCell>
                                {results!.horizontal.solution.widthResults.map((r: WidthResult, index: number) => (
                                  <TableCell key={index} sx={{ fontSize: '1.1rem' }}>
                                    {r.sets2 ?? 0}@{r.adjustedMarks2 ?? 0} mm
                                  </TableCell>
                                ))}
                              </TableRow>
                              {results!.horizontal.solution.widthResults.some(r => (r.remainingTiles2 ?? 0) > 0) && (
                                <TableRow>
                                  <TableCell sx={{ fontSize: '1.1rem' }}>Remaining Tiles 2</TableCell>
                                  {results!.horizontal.solution.widthResults.map((r: WidthResult, index: number) => (
                                    <TableCell key={index} sx={{ fontSize: '1.1rem' }}>
                                      {(r.remainingTiles2 ?? 0) > 0 ? `${r.remainingTiles2} at ${inputs.tileCoverWidth + (r.spacing2 ?? 0)} mm` : ''}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              )}
                            </>
                          )}
                          {results!.horizontal.solution.type === 'cut' && (
                            <TableRow>
                              <TableCell sx={{ fontSize: '1.1rem' }}>Cut Size</TableCell>
                              {results!.horizontal.solution.widthResults.map((r: WidthResult, index: number) => (
                                <TableCell key={index} sx={{ fontSize: '1.1rem' }}>{r.cutTileWidth} mm</TableCell>
                              ))}
                            </TableRow>
                          )}
                          <TableRow>
                            <TableCell sx={{ fontSize: '1.1rem' }}>Tile Spacing</TableCell>
                            {results!.horizontal.solution.widthResults.map((r: WidthResult, index: number) => (
                              <TableCell key={index} sx={{ fontSize: '1.1rem' }}>
                                {results!.horizontal.solution.type === 'split'
                                  ? `${r.spacing1 ?? 0} mm / ${r.spacing2 ?? 0} mm`
                                  : `${r.actualSpacing ?? 0} mm`}
                              </TableCell>
                            ))}
                          </TableRow>
                          {results!.horizontal.warning && (
                            <TableRow>
                              <TableCell sx={{ color: 'error.main', fontSize: '1.1rem' }}>Warning</TableCell>
                              <TableCell colSpan={inputs.widths.length} sx={{ color: 'error.main', fontSize: '1.1rem' }}>
                                {results!.horizontal.warning}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              )}
              {/* Total Results */}
              {inputs.rafterHeights.some(h => h > 0) && inputs.widths.some(w => w > 0) && (
                <Accordion defaultExpanded sx={{ mt: 3 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                      Total Results
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Total Courses: {results!.totalCourses}
                    </Typography>
                    <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: 'success.main' }}>
                      Total Tiles Needed: {results!.totalTiles}
                    </Typography>
                    {results!.halfTiles > 0 && (
                      <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
                        Includes {results!.halfTiles} half tiles due to cross-bonding
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              )}
              {/* Save Results (for Pro Users) */}
              {user.subscription === 'pro' && results !== null && (
                <Box sx={{ mt: 3 }}>
                  <TextField
                    label="Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                    variant="outlined"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveResults}
                    sx={{ py: 1.5, fontSize: '1.2rem' }}
                  >
                    Save Results
                  </Button>
                </Box>
              )}
            </Paper>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={handleBack}
              variant="outlined"
              color="primary"
              sx={{ py: 1.5, fontSize: '1.2rem', minWidth: 120 }}
            >
              Back
            </Button>
            <Button
              onClick={handleRecalculate}
              variant="contained"
              color="primary"
              sx={{ py: 1.5, fontSize: '1.2rem', minWidth: 120 }}
            >
              Recalculate
            </Button>
          </Box>
        </Box>
      )}
      {/* Navigation Buttons */}
      {activeStep < 3 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
            color="primary"
            sx={{ py: 1.5, fontSize: '1.2rem', minWidth: 120 }}
          >
            Back
          </Button>
          {activeStep === 2 ? (
            <Button
              onClick={calculateRoof}
              variant="contained"
              color="primary"
              sx={{ py: 1.5, fontSize: '1.2rem', minWidth: 120 }}
            >
              Calculate
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              variant="contained"
              color="primary"
              sx={{ py: 1.5, fontSize: '1.2rem', minWidth: 120 }}
            >
              Next
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Calculator;