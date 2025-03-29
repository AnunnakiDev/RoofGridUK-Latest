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
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useUser } from '../../context/UserContext';

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

const PersonalTiles: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [personalTiles, setPersonalTiles] = useState<Tile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openTileDialog, setOpenTileDialog] = useState(false);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [sectionExpanded, setSectionExpanded] = useState<boolean>(true); // Open by default

  useEffect(() => {
    if (user.subscription !== 'pro') {
      navigate('/admin/profile');
      return;
    }

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

    fetchPersonalTiles();
  }, [user.subscription, navigate]);

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

  const handlePersonalTileEdit = (tile: Tile) => {
    console.log('Editing personal tile:', tile);
    setSelectedTile({ ...tile, isPersonal: true });
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

  const handleTileDialogClose = () => {
    setOpenTileDialog(false);
    setSelectedTile(null);
  };

  const handleTileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTile) return;

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
      const response = await api.put(`/api/users/tiles/${selectedTile.id}`, payload);
      const updatedTile = { ...response.data, isPersonal: true, type: normalizeTileType(response.data.type) };
      setPersonalTiles(personalTiles.map((tile) => (tile.id === selectedTile.id ? updatedTile : tile)));
      setSuccess('Personal tile updated successfully');
      handleTileDialogClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update tile');
    }
  };

  const handleTileChange = (field: keyof Tile, value: any) => {
    if (selectedTile) {
      setSelectedTile({ ...selectedTile, [field]: value });
    }
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
                <Accordion key={tile.id} sx={{ mb: 1 }} defaultExpanded>
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
                    <Box sx={{ mt: 2, display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handlePersonalTileEdit(tile)}
                        sx={{ py: 1, fontSize: { xs: '0.9rem', sm: '1rem' }, width: { xs: '100%', sm: 'auto' } }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handlePersonalTileCalculate(tile)}
                        sx={{ py: 1, fontSize: { xs: '0.9rem', sm: '1rem' }, width: { xs: '100%', sm: 'auto' } }}
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

      {/* Tile Dialog (Edit) */}
      <Dialog open={openTileDialog} onClose={handleTileDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Tile</DialogTitle>
        <DialogContent>
          {selectedTile && (
            <Box component="form" onSubmit={handleTileSubmit} sx={{ mt: 2 }}>
              <TextField
                label="Name"
                value={selectedTile.name || ''}
                onChange={(e) => handleTileChange('name', e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select
                  value={selectedTile.type || ''}
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
                value={selectedTile.length || 0}
                onChange={(e) => handleTileChange('length', Number(e.target.value))}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Width (mm)"
                type="number"
                value={selectedTile.width || 0}
                onChange={(e) => handleTileChange('width', Number(e.target.value))}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Min Gauge (mm)"
                type="number"
                value={selectedTile.mingauge || 0}
                onChange={(e) => handleTileChange('mingauge', Number(e.target.value))}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Max Gauge (mm)"
                type="number"
                value={selectedTile.maxgauge || 0}
                onChange={(e) => handleTileChange('maxgauge', Number(e.target.value))}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Min Spacing (mm)"
                type="number"
                value={selectedTile.minspacing || 0}
                onChange={(e) => handleTileChange('minspacing', Number(e.target.value))}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Max Spacing (mm)"
                type="number"
                value={selectedTile.maxspacing || 0}
                onChange={(e) => handleTileChange('maxspacing', Number(e.target.value))}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="LH Tile Width (mm)"
                type="number"
                value={selectedTile.lhTileWidth || 0}
                onChange={(e) => handleTileChange('lhTileWidth', Number(e.target.value))}
                fullWidth
                margin="normal"
                inputProps={{ min: 0 }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Cross-Bonded</InputLabel>
                <Select
                  value={selectedTile.crossbonded || 'NO'}
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

export default PersonalTiles;