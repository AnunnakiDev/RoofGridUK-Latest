import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Box,
  Autocomplete,
  TextField,
  Button,
  Typography,
  useMediaQuery,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useUser } from '../context/UserContext';
import api from '../services/api';
import { calculateVertical, VerticalResult } from '../utils/calculateVertical';
import { calculateHorizontal, HorizontalResult } from '../utils/calculateHorizontal';

// Define interfaces for type safety
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
  type: 'addRafter' | 'addWidth' | 'deleteRafter' | 'deleteWidth' | 'setGutterOverhang';
  value?: number;
  index?: number;
}

const MainCalculator: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:600px)');

  // State management
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
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
  const [currentInput, setCurrentInput] = useState('');
  const [inputMode, setInputMode] = useState<'rafter' | 'width' | 'gutter' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingTiles, setIsLoadingTiles] = useState(false);
  const [actionHistory, setActionHistory] = useState<Action[]>([]);

  // Load tiles and pre-fill data
  useEffect(() => {
    if (location.state) {
      if ((location.state as { project: any }).project) {
        const { project } = location.state as { project: any };
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
        navigate('/calculator/results', { state: { results: project, inputs } });
      } else if ((location.state as { tile: Tile }).tile) {
        const { tile } = location.state as { tile: Tile };
        let materialType: string;
        switch (tile.type.toLowerCase()) {
          case 'slate': materialType = 'Slate'; break;
          case 'fibre-cement-slate': materialType = 'Fibre Cement Slate'; break;
          case 'interlocking-tile':
          case 'pantile': materialType = 'Tile'; break;
          case 'plain-tile': materialType = 'Plain Tile'; break;
          default: materialType = tile.type;
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
        setSelectedTile({ ...tile, isPersonal: true });
      }
    }
  }, [location.state, navigate, inputs]);

  // Fetch tiles for pro users
  useEffect(() => {
    const fetchTiles = async () => {
      setIsLoadingTiles(true);
      try {
        const defaultTilesResponse = await api.get('/api/tiles');
        const defaultTiles = defaultTilesResponse.data.map((tile: Tile) => ({ ...tile, isPersonal: false }));
        const tilesList = [...defaultTiles];

        if (user.subscription === 'pro') {
          const personalTilesResponse = await api.get('/api/users/tiles');
          const personalTiles = personalTilesResponse.data.map((tile: Tile) => ({ ...tile, isPersonal: true }));
          tilesList.push(...personalTiles);
        }

        const uniqueTiles = Array.from(new Map(tilesList.map(tile => [tile.name, tile])).values());
        uniqueTiles.sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name));
        setTiles(uniqueTiles);
      } catch (err) {
        setError('Failed to fetch tiles');
      } finally {
        setIsLoadingTiles(false);
      }
    };

    if (user.subscription === 'pro') fetchTiles();
    else setTiles([]);
  }, [user.subscription]);

  // Handle tile selection
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
      case 'slate': materialType = 'Slate'; break;
      case 'fibre-cement-slate': materialType = 'Fibre Cement Slate'; break;
      case 'interlocking-tile':
      case 'pantile': materialType = 'Tile'; break;
      case 'plain-tile': materialType = 'Plain Tile'; break;
      default: materialType = value.type;
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

  // Keypad handlers
  const handleKeypadInput = (value: string) => setCurrentInput(prev => prev + value);

  const handleAddRafter = () => setInputMode('rafter');
  const handleAddWidth = () => setInputMode('width');

  const handleDelete = () => {
    if (inputMode === 'rafter' && inputs.rafterHeights.length > 0) {
      setInputs(prev => ({
        ...prev,
        rafterHeights: prev.rafterHeights.slice(0, -1),
        rafterHeightNames: prev.rafterHeightNames.slice(0, -1),
      }));
      setActionHistory(prev => [...prev, { type: 'deleteRafter', index: inputs.rafterHeights.length - 1 }]);
    } else if (inputMode === 'width' && inputs.widths.length > 0) {
      setInputs(prev => ({
        ...prev,
        widths: prev.widths.slice(0, -1),
        widthNames: prev.widthNames.slice(0, -1),
      }));
      setActionHistory(prev => [...prev, { type: 'deleteWidth', index: inputs.widths.length - 1 }]);
    }
    setCurrentInput('');
  };

  const handleUndo = () => {
    if (actionHistory.length === 0) return;
    const lastAction = actionHistory[actionHistory.length - 1];
    if (lastAction.type === 'addRafter') {
      setInputs(prev => ({
        ...prev,
        rafterHeights: prev.rafterHeights.slice(0, -1),
        rafterHeightNames: prev.rafterHeightNames.slice(0, -1),
      }));
    } else if (lastAction.type === 'addWidth') {
      setInputs(prev => ({
        ...prev,
        widths: prev.widths.slice(0, -1),
        widthNames: prev.widthNames.slice(0, -1),
      }));
    }
    setActionHistory(prev => prev.slice(0, -1));
  };

  const handleEnter = () => {
    const value = Number(currentInput);
    if (inputMode === 'rafter') {
      setInputs(prev => ({
        ...prev,
        rafterHeights: [...prev.rafterHeights, value],
        rafterHeightNames: [...prev.rafterHeightNames, `Rafter ${prev.rafterHeights.length + 1}`],
      }));
      setActionHistory(prev => [...prev, { type: 'addRafter', value }]);
    } else if (inputMode === 'width') {
      setInputs(prev => ({
        ...prev,
        widths: [...prev.widths, value],
        widthNames: [...prev.widthNames, `Width ${prev.widths.length + 1}`],
      }));
      setActionHistory(prev => [...prev, { type: 'addWidth', value }]);
    } else if (inputMode === 'gutter') {
      setInputs(prev => ({ ...prev, gutterOverhang: value }));
      setActionHistory(prev => [...prev, { type: 'setGutterOverhang', value }]);
      setInputMode(null);
    }
    setCurrentInput('');
  };

  const handleCalculate = () => {
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
        : verticalResult.solution.n_spaces;
      const tilesPerCourse = horizontalResult.solution.type === 'split'
        ? horizontalResult.tilesWide
        : horizontalResult.tilesWide;
      const halfTiles = inputs.crossBonded === 'YES' ? Math.ceil(totalCourses / 2) : 0;
      const totalTiles = tilesPerCourse * totalCourses + halfTiles;

      navigate('/calculator/results', {
        state: {
          results: { vertical: verticalResult, horizontal: horizontalResult, totalCourses, totalTiles, halfTiles },
          inputs,
        },
      });
    } catch (err: any) {
      setError(err.message || 'Calculation failed');
    }
  };

  const isReadyToCalculate = selectedTile && (inputs.rafterHeights.length > 0 || inputs.widths.length > 0);

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
        <Button component={Link} to="/profile" color="inherit">Back to Profile</Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {isLoadingTiles ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Tile Selection */}
            <Box sx={{ mb: 2 }}>
              <Autocomplete
                options={tiles}
                getOptionLabel={(option) => (option.isPersonal ? `Personal: ${option.name}` : option.name)}
                value={selectedTile}
                onChange={handleTileSelect}
                renderInput={(params) => <TextField {...params} label="Select Tile" variant="outlined" fullWidth />}
              />
              <Button variant="contained" sx={{ mt: 1 }} onClick={() => navigate('/calculator/tile-data')}>
                Add New
              </Button>
            </Box>

            {/* Settings */}
            <Typography sx={{ mb: 1 }}>Please select your settings:</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <Button
                variant="outlined"
                sx={{ bgcolor: inputs.useDryRidge === 'YES' ? 'primary.main' : 'inherit', color: inputs.useDryRidge === 'YES' ? 'white' : 'inherit' }}
                onClick={() => setInputs({ ...inputs, useDryRidge: inputs.useDryRidge === 'YES' ? 'NO' : 'YES' })}
              >
                {inputs.useDryRidge === 'YES' ? 'Dry Ridge' : 'Wet Ridge'}
              </Button>
              <Button
                variant="outlined"
                sx={{ bgcolor: inputs.useLHTile === 'YES' ? 'primary.main' : 'inherit', color: inputs.useLHTile === 'YES' ? 'white' : 'inherit' }}
                onClick={() => setInputs({ ...inputs, useLHTile: inputs.useLHTile === 'YES' ? 'NO' : 'YES' })}
              >
                LH Tile: {inputs.useLHTile}
              </Button>
              <Button
                variant="outlined"
                sx={{ bgcolor: inputs.leftVergeType !== 'Wet' ? 'primary.main' : 'inherit', color: inputs.leftVergeType !== 'Wet' ? 'white' : 'inherit' }}
                onClick={() => {
                  const newType = inputs.leftVergeType === 'Wet' ? 'Dry' : inputs.leftVergeType === 'Dry' ? 'Abutment' : 'Wet';
                  setInputs({ ...inputs, leftVergeType: newType });
                }}
              >
                LH Verge: {inputs.leftVergeType}
              </Button>
              <Button
                variant="outlined"
                sx={{ bgcolor: inputs.rightVergeType !== 'Wet' ? 'primary.main' : 'inherit', color: inputs.rightVergeType !== 'Wet' ? 'white' : 'inherit' }}
                onClick={() => {
                  const newType = inputs.rightVergeType === 'Wet' ? 'Dry' : inputs.rightVergeType === 'Dry' ? 'Abutment' : 'Wet';
                  setInputs({ ...inputs, rightVergeType: newType });
                }}
              >
                RH Verge: {inputs.rightVergeType}
              </Button>
              <Button
                variant="outlined"
                onClick={() => { setInputMode('gutter'); setCurrentInput(inputs.gutterOverhang.toString()); }}
              >
                Gutter Overhang: {inputs.gutterOverhang} mm
              </Button>
            </Box>

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
              {inputs.rafterHeights.map((height, index) => (
                <Typography key={index} sx={{ textAlign: 'right' }}>
                  <span style={{ float: 'left' }}>{inputs.rafterHeightNames[index]}:</span> {height} mm
                </Typography>
              ))}
              {inputs.widths.map((width, index) => (
                <Typography key={index} sx={{ textAlign: 'right' }}>
                  <span style={{ float: 'left' }}>{inputs.widthNames[index]}:</span> {width} mm
                </Typography>
              ))}
              {inputMode && (
                <Typography sx={{ textAlign: 'right' }}>
                  <span style={{ float: 'left' }}>
                    {inputMode === 'rafter' ? `Rafter ${inputs.rafterHeights.length + 1}` :
                     inputMode === 'width' ? `Width ${inputs.widths.length + 1}` : 'Gutter Overhang'}:
                  </span>
                  {currentInput || '0'} {inputMode === 'gutter' ? 'mm' : 'mm'}
                </Typography>
              )}
            </Box>

            {/* Keypad */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
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
              {['4', '5', '6', 'Add Rafter'].map(label => (
                <Button
                  key={label}
                  variant="outlined"
                  sx={{ minWidth: 0, padding: 1 }}
                  onClick={() => label === 'Add Rafter' ? handleAddRafter() : handleKeypadInput(label)}
                >
                  {label}
                </Button>
              ))}
              {['1', '2', '3', 'Add Width'].map(label => (
                <Button
                  key={label}
                  variant="outlined"
                  sx={{ minWidth: 0, padding: 1 }}
                  onClick={() => label === 'Add Width' ? handleAddWidth() : handleKeypadInput(label)}
                >
                  {label}
                </Button>
              ))}
              {['Undo', '0', 'Enter'].map(label => (
                <Button
                  key={label}
                  variant="outlined"
                  sx={{ minWidth: 0, padding: 1 }}
                  onClick={() => label === 'Undo' ? handleUndo() : label === 'Enter' ? (isReadyToCalculate ? handleCalculate() : handleEnter()) : handleKeypadInput(label)}
                >
                  {label === 'Enter' && isReadyToCalculate ? 'Calculate' : label}
                </Button>
              ))}
            </Box>
          </>
        )}
      </Box>

      {/* Footer Tabs */}
      <Box sx={{ borderTop: '1px solid #ccc', p: 1, display: 'flex', justifyContent: 'space-around' }}>
        <Button onClick={() => navigate('/calculator/tile-data', { state: { tile: selectedTile } })}>Edit Tile</Button>
        <Button disabled>Settings</Button>
        <Button onClick={handleCalculate} disabled={!isReadyToCalculate}>Results</Button>
      </Box>
    </Box>
  );
};

export default MainCalculator;