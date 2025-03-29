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
import api from '../../services/api';

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

const TileManagement: React.FC = () => {
  const [defaultTiles, setDefaultTiles] = useState<Tile[]>([]);
  const [filteredTiles, setFilteredTiles] = useState<Tile[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openTileDialog, setOpenTileDialog] = useState(false);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [newTile, setNewTile] = useState<Tile | null>(null);
  const [sectionExpanded, setSectionExpanded] = useState<boolean>(true); // Open by default
  const [expandedType, setExpandedType] = useState<string | false>(false);

  useEffect(() => {
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
        // Open the first type accordion by default
        if (sortedTiles.length > 0) {
          const types = Array.from(new Set<string>(sortedTiles.map((tile: Tile) => tile.type))).sort();
          const firstType = types[0] as string; // Explicitly cast to string
          setExpandedType(firstType);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch default tiles');
      }
    };

    fetchDefaultTiles();
  }, []);

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
        return type;
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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
      // Edit existing tile
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
        const response = await api.put(`/api/tiles/${selectedTile.id}`, payload);
        const updatedTile = { ...response.data, type: normalizeTileType(response.data.type) };
        setDefaultTiles(defaultTiles.map((tile) => (tile.id === selectedTile.id ? updatedTile : tile)));
        setFilteredTiles(filteredTiles.map((tile) => (tile.id === selectedTile.id ? updatedTile : tile)));
        setSuccess('Default tile updated successfully');
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
            Tile Management
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on mobile
              justifyContent: 'space-between',
              mb: 2,
              gap: 2,
              px: { xs: 1, sm: 0 }, // Add padding on mobile
            }}
          >
            <TextField
              label="Search Tiles"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ width: { xs: '100%', sm: '300px' } }} // Full width on mobile
              variant="outlined"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleDefaultTileAdd}
              sx={{
                py: 1,
                fontSize: { xs: '0.9rem', sm: '1rem' },
                width: { xs: '100%', sm: 'auto' }, // Full width on mobile
              }}
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
                  defaultExpanded // Open by default
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 'medium', color: 'primary.main', fontSize: { xs: '1rem', sm: '1.25rem' } }}
                    >
                      {type} ({tilesByType[type].length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {tilesByType[type].map((tile) => (
                      <Accordion key={tile.id} sx={{ mb: 1 }} defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: 'medium', color: 'primary.main', fontSize: { xs: '0.9rem', sm: '1.1rem' } }}
                            >
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
    </>
  );
};

export default TileManagement;