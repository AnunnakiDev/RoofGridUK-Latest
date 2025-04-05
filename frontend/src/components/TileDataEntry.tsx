import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  ToggleButton,
  Alert,
  useMediaQuery,
  CircularProgress,
  Button,
} from '@mui/material';
import api from '../services/api';
import Keypad from './Keypad';
import Navbar from './Navbar';
import Footer from './Footer';

// Define interfaces (copied from original Calculator.tsx for consistency)
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

interface Action {
  type: 'setField';
  field: keyof FormInputs;
  value: any;
}

const TileDataEntry: React.FC = () => {
  // Navigation and media query hooks
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:600px)');

  // State for the current step in the tile data entry process
  const [currentStep, setCurrentStep] = useState(0);

  // State for form inputs, initialized with default values
  const [inputs, setInputs] = useState<FormInputs>({
    tileSelection: '',
    tileName: '',
    rafterHeights: [],
    rafterHeightNames: [],
    widths: [],
    widthNames: [],
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

  // State for the current keypad input
  const [currentInput, setCurrentInput] = useState('');

  // State for errors and loading
  const [error, setError] = useState<string | null>(null);
  const [isSavingTile, setIsSavingTile] = useState(false);

  // State for action history (for Undo functionality)
  const [actionHistory, setActionHistory] = useState<Action[]>([]);
  const [undoStack, setUndoStack] = useState<Action[]>([]);

  // Define the steps for the tile data entry process
  const steps = [
    'Tile Name',
    'Material Type',
    'Tile Length (mm)',
    'Tile Width (mm)',
    'Min Gauge (mm)',
    'Max Gauge (mm)',
    'Min Spacing (mm)',
    'Max Spacing (mm)',
    'LH Tile Width (mm)',
    'Cross-Bonded',
    'Save Tile',
  ];

  // Pre-fill inputs if editing an existing tile
  useEffect(() => {
    if (location.state && (location.state as { tile: Tile }).tile) {
      const { tile } = location.state as { tile: Tile };
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
      const crossBondedValue = tile.crossbonded === 'YES' || tile.crossbonded === 'NO' ? tile.crossbonded : 'NO';
      setInputs({
        ...inputs,
        tileSelection: tile.id.toString(),
        tileName: tile.name,
        materialType,
        slateTileHeight: tile.length,
        tileCoverWidth: tile.width,
        minGauge: tile.mingauge ?? 75,
        maxGauge: tile.maxgauge ?? 325,
        minSpacing: tile.minspacing ?? 3,
        maxSpacing: tile.maxspacing ?? 7,
        lhTileWidth: tile.lhTileWidth || 0,
        crossBonded: crossBondedValue as 'YES' | 'NO',
      });
    }
  }, [location.state]);

  // Handle keypad input for numerical fields
  const handleKeypadInput = (value: string) => {
    setCurrentInput((prev) => prev + value);
  };

  // Handle Enter to move to the next step or save the tile
  const handleEnter = () => {
    if (currentStep === 0) {
      // Step 1: Tile Name (text input)
      if (!currentInput) {
        setError('Tile Name is required');
        return;
      }
      setInputs((prev) => ({ ...prev, tileName: currentInput }));
      setActionHistory((prev) => [...prev, { type: 'setField', field: 'tileName', value: currentInput }]);
      setUndoStack([]);
    } else if (currentStep === 1) {
      // Step 2: Material Type (dropdown, handled via buttons)
      if (!inputs.materialType) {
        setError('Material Type is required');
        return;
      }
    } else if (currentStep === 2) {
      // Step 3: Tile Length (numerical)
      const value = Number(currentInput);
      if (value <= 0) {
        setError('Tile Length must be greater than 0');
        return;
      }
      setInputs((prev) => ({ ...prev, slateTileHeight: value }));
      setActionHistory((prev) => [...prev, { type: 'setField', field: 'slateTileHeight', value }]);
      setUndoStack([]);
    } else if (currentStep === 3) {
      // Step 4: Tile Width (numerical)
      const value = Number(currentInput);
      if (value <= 0) {
        setError('Tile Width must be greater than 0');
        return;
      }
      setInputs((prev) => ({ ...prev, tileCoverWidth: value }));
      setActionHistory((prev) => [...prev, { type: 'setField', field: 'tileCoverWidth', value }]);
      setUndoStack([]);
    } else if (currentStep === 4) {
      // Step 5: Min Gauge (numerical)
      const value = Number(currentInput);
      if (value <= 0) {
        setError('Min Gauge must be greater than 0');
        return;
      }
      if (inputs.maxGauge && value > inputs.maxGauge) {
        setError('Min Gauge must be less than or equal to Max Gauge');
        return;
      }
      setInputs((prev) => ({ ...prev, minGauge: value }));
      setActionHistory((prev) => [...prev, { type: 'setField', field: 'minGauge', value }]);
      setUndoStack([]);
    } else if (currentStep === 5) {
      // Step 6: Max Gauge (numerical)
      const value = Number(currentInput);
      if (value <= 0) {
        setError('Max Gauge must be greater than 0');
        return;
      }
      if (inputs.minGauge && value < inputs.minGauge) {
        setError('Max Gauge must be greater than or equal to Min Gauge');
        return;
      }
      setInputs((prev) => ({ ...prev, maxGauge: value }));
      setActionHistory((prev) => [...prev, { type: 'setField', field: 'maxGauge', value }]);
      setUndoStack([]);
    } else if (currentStep === 6) {
      // Step 7: Min Spacing (numerical)
      const value = Number(currentInput);
      if (value <= 0) {
        setError('Min Spacing must be greater than 0');
        return;
      }
      if (inputs.maxSpacing && value > inputs.maxSpacing) {
        setError('Min Spacing must be less than or equal to Max Spacing');
        return;
      }
      setInputs((prev) => ({ ...prev, minSpacing: value }));
      setActionHistory((prev) => [...prev, { type: 'setField', field: 'minSpacing', value }]);
      setUndoStack([]);
    } else if (currentStep === 7) {
      // Step 8: Max Spacing (numerical)
      const value = Number(currentInput);
      if (value <= 0) {
        setError('Max Spacing must be greater than 0');
        return;
      }
      if (inputs.minSpacing && value < inputs.minSpacing) {
        setError('Max Spacing must be greater than or equal to Min Spacing');
        return;
      }
      setInputs((prev) => ({ ...prev, maxSpacing: value }));
      setActionHistory((prev) => [...prev, { type: 'setField', field: 'maxSpacing', value }]);
      setUndoStack([]);
    } else if (currentStep === 8) {
      // Step 9: LH Tile Width (numerical)
      const value = Number(currentInput);
      if (value < 0) {
        setError('LH Tile Width must be 0 or greater');
        return;
      }
      setInputs((prev) => ({ ...prev, lhTileWidth: value }));
      setActionHistory((prev) => [...prev, { type: 'setField', field: 'lhTileWidth', value }]);
      setUndoStack([]);
    } else if (currentStep === 9) {
      // Step 10: Cross-Bonded (toggle)
      setInputs((prev) => ({ ...prev, crossBonded: prev.crossBonded === 'YES' ? 'NO' : 'YES' }));
      setActionHistory((prev) => [...prev, { type: 'setField', field: 'crossBonded', value: inputs.crossBonded === 'YES' ? 'NO' : 'YES' }]);
      setUndoStack([]);
    } else if (currentStep === 10) {
      // Step 11: Save Tile
      handleSaveTile();
      return;
    }
    setError(null);
    setCurrentInput('');
    setCurrentStep((prev) => prev + 1);
  };

  // Handle Back to move to the previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setCurrentInput('');
      setError(null);
    }
  };

  // Handle Delete to clear the current input
  const handleDelete = () => {
    setCurrentInput('');
  };

  // Handle Undo to revert the last action
  const handleUndo = () => {
    if (actionHistory.length === 0) return;
    const lastAction = actionHistory[actionHistory.length - 1];
    if (lastAction.type === 'setField') {
      setInputs((prev) => ({
        ...prev,
        [lastAction.field]: lastAction.field === 'crossBonded' ? (lastAction.value === 'YES' ? 'NO' : 'YES') : lastAction.field === 'materialType' ? '' : 0,
      }));
    }
    setActionHistory((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, lastAction]);
    setCurrentInput('');
  };

  // Handle saving the tile via API
  const handleSaveTile = async () => {
    // Validate all required fields before saving
    if (!inputs.tileName) {
      setError('Tile Name is required');
      setCurrentStep(0);
      return;
    }
    if (!inputs.materialType) {
      setError('Material Type is required');
      setCurrentStep(1);
      return;
    }
    if (inputs.slateTileHeight <= 0) {
      setError('Tile Length must be greater than 0');
      setCurrentStep(2);
      return;
    }
    if (inputs.tileCoverWidth <= 0) {
      setError('Tile Width must be greater than 0');
      setCurrentStep(3);
      return;
    }
    if (inputs.minGauge && inputs.minGauge <= 0) {
      setError('Min Gauge must be greater than 0');
      setCurrentStep(4);
      return;
    }
    if (inputs.maxGauge && inputs.maxGauge <= 0) {
      setError('Max Gauge must be greater than 0');
      setCurrentStep(5);
      return;
    }
    if (inputs.minGauge && inputs.maxGauge && inputs.minGauge > inputs.maxGauge) {
      setError('Min Gauge must be less than or equal to Max Gauge');
      setCurrentStep(4);
      return;
    }
    if (inputs.minSpacing && inputs.minSpacing <= 0) {
      setError('Min Spacing must be greater than 0');
      setCurrentStep(6);
      return;
    }
    if (inputs.maxSpacing && inputs.maxSpacing <= 0) {
      setError('Max Spacing must be greater than 0');
      setCurrentStep(7);
      return;
    }
    if (inputs.minSpacing && inputs.maxSpacing && inputs.minSpacing > inputs.maxSpacing) {
      setError('Min Spacing must be less than or equal to Max Spacing');
      setCurrentStep(6);
      return;
    }
    if (inputs.lhTileWidth < 0) {
      setError('LH Tile Width must be 0 or greater');
      setCurrentStep(8);
      return;
    }

    setIsSavingTile(true);
    try {
      const payload = {
        name: inputs.tileName,
        type: inputs.materialType,
        length: Number(inputs.slateTileHeight),
        width: Number(inputs.tileCoverWidth),
        mingauge: inputs.minGauge,
        maxgauge: inputs.maxGauge,
        minspacing: inputs.minSpacing,
        maxspacing: inputs.maxSpacing,
        lhTileWidth: Number(inputs.lhTileWidth),
        crossbonded: inputs.crossBonded,
      };
      const response = await api.post('/api/users/tiles', payload);
      const newTile: Tile = { ...response.data, isPersonal: true };
      navigate('/calculator', { state: { tile: newTile } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save custom tile');
    } finally {
      setIsSavingTile(false);
    }
  };

  // Handle material type selection
  const handleMaterialTypeSelect = (type: string) => {
    setInputs((prev) => ({ ...prev, materialType: type }));
    setActionHistory((prev) => [...prev, { type: 'setField', field: 'materialType', value: type }]);
    setUndoStack([]);
    setCurrentStep((prev) => prev + 1);
  };

  // Determine the current step label for display in the viewport
  const getCurrentStepLabel = () => {
    if (currentStep === 0) return 'Tile Name';
    if (currentStep === 1) return 'Material Type';
    if (currentStep === 2) return 'Tile Length (mm)';
    if (currentStep === 3) return 'Tile Width (mm)';
    if (currentStep === 4) return 'Min Gauge (mm)';
    if (currentStep === 5) return 'Max Gauge (mm)';
    if (currentStep === 6) return 'Min Spacing (mm)';
    if (currentStep === 7) return 'Max Spacing (mm)';
    if (currentStep === 8) return 'LH Tile Width (mm)';
    if (currentStep === 9) return 'Cross-Bonded';
    return 'Save Tile';
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        maxWidth: isMobile ? '100%' : '400px', // Fixed width on desktop, fullscreen on mobile
        margin: isMobile ? 0 : 'auto',
        border: isMobile ? 'none' : '1px solid #ccc',
        borderRadius: isMobile ? 0 : '8px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Typography>Logo</Typography>
        <Button component={Link} to="/profile" color="inherit">
          Back to Profile
        </Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {/* Calculator Screen */}
        <Box
          sx={{
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: 2,
            minHeight: '150px',
            maxHeight: '200px',
            overflowY: 'auto',
            bgcolor: '#f5f5f5',
            mb: 2,
          }}
        >
          {inputs.tileName && (
            <Typography sx={{ textAlign: 'right' }}>
              <span style={{ float: 'left' }}>Tile Name:</span> {inputs.tileName}
            </Typography>
          )}
          {inputs.materialType && (
            <Typography sx={{ textAlign: 'right' }}>
              <span style={{ float: 'left' }}>Material Type:</span> {inputs.materialType}
            </Typography>
          )}
          {inputs.slateTileHeight > 0 && (
            <Typography sx={{ textAlign: 'right' }}>
              <span style={{ float: 'left' }}>Tile Length (mm):</span> {inputs.slateTileHeight} mm
            </Typography>
          )}
          {inputs.tileCoverWidth > 0 && (
            <Typography sx={{ textAlign: 'right' }}>
              <span style={{ float: 'left' }}>Tile Width (mm):</span> {inputs.tileCoverWidth} mm
            </Typography>
          )}
          {inputs.minGauge !== 75 && (
            <Typography sx={{ textAlign: 'right' }}>
              <span style={{ float: 'left' }}>Min Gauge (mm):</span> {inputs.minGauge} mm
            </Typography>
          )}
          {inputs.maxGauge !== 325 && (
            <Typography sx={{ textAlign: 'right' }}>
              <span style={{ float: 'left' }}>Max Gauge (mm):</span> {inputs.maxGauge} mm
            </Typography>
          )}
          {inputs.minSpacing !== 3 && (
            <Typography sx={{ textAlign: 'right' }}>
              <span style={{ float: 'left' }}>Min Spacing (mm):</span> {inputs.minSpacing} mm
            </Typography>
          )}
          {inputs.maxSpacing !== 7 && (
            <Typography sx={{ textAlign: 'right' }}>
              <span style={{ float: 'left' }}>Max Spacing (mm):</span> {inputs.maxSpacing} mm
            </Typography>
          )}
          {inputs.lhTileWidth > 0 && (
            <Typography sx={{ textAlign: 'right' }}>
              <span style={{ float: 'left' }}>LH Tile Width (mm):</span> {inputs.lhTileWidth} mm
            </Typography>
          )}
          {inputs.crossBonded !== 'NO' && (
            <Typography sx={{ textAlign: 'right' }}>
              <span style={{ float: 'left' }}>Cross-Bonded:</span> {inputs.crossBonded}
            </Typography>
          )}
          {/* Display the current step */}
          {currentStep < steps.length && (
            <Typography sx={{ textAlign: 'right' }}>
              <span style={{ float: 'left' }}>{getCurrentStepLabel()}:</span>
              {currentStep === 0 || currentStep === 1 || currentStep === 9 ? '' : (currentInput || '0')}
              {currentStep >= 2 && currentStep <= 8 ? ' mm' : ''}
            </Typography>
          )}
        </Box>

        {/* Current Input Field Based on the Step */}
        {currentStep === 0 ? (
          <TextField
            label="Tile Name"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            fullWidth
            sx={{ mb: 1 }}
          />
        ) : currentStep === 1 ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Button variant="outlined" onClick={() => handleMaterialTypeSelect('Slate')}>
              Slate
            </Button>
            <Button variant="outlined" onClick={() => handleMaterialTypeSelect('Tile')}>
              Tile
            </Button>
            <Button variant="outlined" onClick={() => handleMaterialTypeSelect('Fibre Cement Slate')}>
              Fibre Cement Slate
            </Button>
            <Button variant="outlined" onClick={() => handleMaterialTypeSelect('Plain Tile')}>
              Plain Tile
            </Button>
          </Box>
        ) : currentStep === 9 ? (
          <ToggleButton
            value="crossBonded"
            selected={inputs.crossBonded === 'YES'}
            onChange={() => handleEnter()}
          >
            Cross-Bonded: {inputs.crossBonded}
          </ToggleButton>
        ) : currentStep === 10 ? (
          <Button
            variant="contained"
            onClick={handleSaveTile}
            disabled={isSavingTile}
          >
            {isSavingTile ? <CircularProgress size={24} /> : 'Save Tile'}
          </Button>
        ) : null}

        {/* Keypad for Numerical Inputs */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, mt: 2 }}>
          {['7', '8', '9', 'Delete'].map(label => (
            <Button
              key={label}
              variant="outlined"
              sx={{ minWidth: 0, padding: 1 }}
              onClick={() => label === 'Delete' ? handleDelete() : handleKeypadInput(label)}
            >
              {label}
            </Button>
          ))}
          {['4', '5', '6', 'Back'].map(label => (
            <Button
              key={label}
              variant="outlined"
              sx={{ minWidth: 0, padding: 1 }}
              onClick={() => label === 'Back' ? handleBack() : handleKeypadInput(label)}
            >
              {label}
            </Button>
          ))}
          {['1', '2', '3', 'Undo'].map(label => (
            <Button
              key={label}
              variant="outlined"
              sx={{ minWidth: 0, padding: 1 }}
              onClick={() => label === 'Undo' ? handleUndo() : handleKeypadInput(label)}
            >
              {label}
            </Button>
          ))}
          {['0', 'Enter'].map(label => (
            <Button
              key={label}
              variant="outlined"
              sx={{ minWidth: 0, padding: 1, gridColumn: label === '0' ? 'span 2' : 'span 1' }}
              onClick={() => label === 'Enter' ? (currentStep === steps.length - 1 ? handleSaveTile() : handleEnter()) : handleKeypadInput(label)}
            >
              {label === 'Enter' && currentStep === steps.length - 1 ? 'Save' : label}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Footer Tabs */}
      <Box sx={{ borderTop: '1px solid #ccc', p: 1, display: 'flex', justifyContent: 'space-around' }}>
        <Button onClick={() => navigate('/calculator')}>Back to Calculator</Button>
      </Box>
    </Box>
  );
};

export default TileDataEntry;