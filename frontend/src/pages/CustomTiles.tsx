import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Container,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useUser } from '../context/UserContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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

const CustomTiles: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [tiles, setTiles] = useState<CustomTile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedTile, setSelectedTile] = useState<CustomTile | null>(null);

  useEffect(() => {
    if (!user.id) {
      navigate('/login');
      return;
    }

    if (user.subscription !== 'pro') {
      setError('Pro subscription required to manage custom tiles');
      return;
    }

    const fetchTiles = async () => {
      try {
        const response = await api.get('/api/users/tiles');
        setTiles(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch custom tiles');
      }
    };

    fetchTiles();
  }, [user.id, user.subscription, navigate]);

  const handleEdit = (tile: CustomTile) => {
    setSelectedTile(tile);
    setOpen(true);
  };

  const handleDelete = async (tileId: number) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
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

  const handleChange = (field: keyof CustomTile, value: any) => {
    if (selectedTile) {
      setSelectedTile({ ...selectedTile, [field]: value });
    }
  };

  if (user.subscription !== 'pro') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box sx={{ flexGrow: 1, pt: { xs: '64px', md: '80px' }, pb: { xs: '80px', md: '100px' } }}>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Alert severity="error">{error}</Alert>
          </Container>
        </Box>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box sx={{ flexGrow: 1, pt: { xs: '64px', md: '80px' }, pb: { xs: '80px', md: '100px' } }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 4, color: '#1b75bc' }}>
            Manage Custom Tiles
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
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
                        <IconButton onClick={() => handleEdit(tile)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(tile.id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Container>
      </Box>
      <Footer />

      {/* Edit Tile Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Tile</DialogTitle>
        <DialogContent>
          {selectedTile && (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                label="Name"
                value={selectedTile.name}
                onChange={(e) => handleChange('name', e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select
                  value={selectedTile.type}
                  onChange={(e) => handleChange('type', e.target.value)}
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
                onChange={(e) => handleChange('length', Number(e.target.value))}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Width (mm)"
                type="number"
                value={selectedTile.width}
                onChange={(e) => handleChange('width', Number(e.target.value))}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Min Gauge (mm)"
                type="number"
                value={selectedTile.mingauge}
                onChange={(e) => handleChange('mingauge', Number(e.target.value))}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Max Gauge (mm)"
                type="number"
                value={selectedTile.maxgauge}
                onChange={(e) => handleChange('maxgauge', Number(e.target.value))}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Min Spacing (mm)"
                type="number"
                value={selectedTile.minspacing}
                onChange={(e) => handleChange('minspacing', Number(e.target.value))}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Max Spacing (mm)"
                type="number"
                value={selectedTile.maxspacing}
                onChange={(e) => handleChange('maxspacing', Number(e.target.value))}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="LH Tile Width (mm)"
                type="number"
                value={selectedTile.lhTileWidth}
                onChange={(e) => handleChange('lhTileWidth', Number(e.target.value))}
                fullWidth
                margin="normal"
                inputProps={{ min: 0 }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Cross-Bonded</InputLabel>
                <Select
                  value={selectedTile.crossbonded}
                  onChange={(e) => handleChange('crossbonded', e.target.value as 'YES' | 'NO')}
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
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomTiles;