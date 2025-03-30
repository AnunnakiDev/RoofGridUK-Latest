import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Card,
  CardContent,
  Link,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalculateIcon from '@mui/icons-material/Calculate';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useUser } from '../../context/UserContext';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

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
  createdAt?: string; // Assuming the API returns a createdAt timestamp
}

const PersonalTiles: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detect mobile screens (xs to sm)
  const [personalTiles, setPersonalTiles] = useState<Tile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openTileDialog, setOpenTileDialog] = useState(false);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const [favorites, setFavorites] = useState<number[]>([]); // Store favorite tile IDs

  useEffect(() => {
    if (user?.subscription !== 'pro') {
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
  }, [user?.subscription, navigate]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteTiles');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

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
    setSelectedTile({ ...tile, isPersonal: true });
    setOpenTileDialog(true);
  };

  const handlePersonalTileDelete = async (tileId: number) => {
    if (window.confirm('Are you sure you want to delete this tile?')) {
      try {
        await api.delete(`/api/users/tiles/${tileId}`);
        setPersonalTiles(personalTiles.filter((tile) => tile.id !== tileId));
        // Remove from favorites if deleted
        if (favorites.includes(tileId)) {
          const updatedFavorites = favorites.filter((id) => id !== tileId);
          setFavorites(updatedFavorites);
          localStorage.setItem('favoriteTiles', JSON.stringify(updatedFavorites));
        }
        setSuccess('Personal tile deleted successfully');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete personal tile');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectionModel.length === 0) {
      setError('Please select at least one tile to delete');
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${selectionModel.length} tile(s)?`)) {
      try {
        await api.post('/api/user-tiles/bulk-delete', { ids: selectionModel });
        setPersonalTiles(personalTiles.filter((tile) => !selectionModel.includes(tile.id)));
        // Remove deleted tiles from favorites
        const updatedFavorites = favorites.filter((id) => !selectionModel.includes(id));
        setFavorites(updatedFavorites);
        localStorage.setItem('favoriteTiles', JSON.stringify(updatedFavorites));
        setSelectionModel([]);
        setSuccess('Selected tiles deleted successfully');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete selected tiles');
      }
    }
  };

  const handlePersonalTileCalculate = (tile: Tile) => {
    navigate('/calculator', { state: { tile } });
  };

  const handleToggleFavorite = (tileId: number) => {
    const updatedFavorites = favorites.includes(tileId)
      ? favorites.filter((id) => id !== tileId)
      : [...favorites, tileId];
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteTiles', JSON.stringify(updatedFavorites));
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

  // Get recently uploaded tiles (assuming createdAt exists; otherwise, sort by ID descending)
  const recentlyUploadedTiles = [...personalTiles]
    .sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return b.id - a.id; // Fallback to ID if createdAt is unavailable
    })
    .slice(0, 3);

  // Get favorited tiles
  const favoriteTiles = personalTiles.filter((tile) => favorites.includes(tile.id));

  const columns: GridColDef[] = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handlePersonalTileEdit(params.row)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handlePersonalTileDelete(params.row.id)} color="error">
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => handlePersonalTileCalculate(params.row)} color="primary">
            <CalculateIcon />
          </IconButton>
          <IconButton onClick={() => handleToggleFavorite(params.row.id)} color="primary">
            {favorites.includes(params.row.id) ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>
        </>
      ),
    },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150, sortable: true },
    { field: 'type', headerName: 'Type', flex: 1, minWidth: 120, sortable: true },
    { field: 'length', headerName: 'Length (mm)', width: 120, sortable: true, type: 'number' },
    { field: 'width', headerName: 'Width (mm)', width: 120, sortable: true, type: 'number' },
    { field: 'mingauge', headerName: 'Min Gauge (mm)', width: 120, sortable: true, type: 'number' },
    { field: 'maxgauge', headerName: 'Max Gauge (mm)', width: 120, sortable: true, type: 'number' },
    { field: 'minspacing', headerName: 'Min Spacing (mm)', width: 120, sortable: true, type: 'number' },
    { field: 'maxspacing', headerName: 'Max Spacing (mm)', width: 120, sortable: true, type: 'number' },
    { field: 'lhTileWidth', headerName: 'LH Tile Width (mm)', width: 120, sortable: true, type: 'number' },
    { field: 'crossbonded', headerName: 'Cross-Bonded', width: 100, sortable: true },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Page Title and Introduction */}
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
        Personal Tiles
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', maxWidth: 800 }}>
        Personal Tiles allow Pro users to create and manage custom tiles tailored to their roofing projects. Use the table below to view, edit, or delete your tiles, and mark your favorites for quick access. You can also add new tiles directly in the Calculator.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {personalTiles.length === 0 ? (
        <Typography align="center" color="text.secondary">
          No personal tiles found. Add a new tile in the Calculator.
        </Typography>
      ) : (
        <>
          {/* DataGrid for Managing Tiles */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleBulkDelete}
              disabled={selectionModel.length === 0}
              sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' }, px: { xs: 2, sm: 3 } }}
            >
              Delete Selected ({selectionModel.length})
            </Button>
          </Box>
          <Box sx={{ height: 400, width: '100%', mb: 4 }}>
            <DataGrid
              rows={personalTiles}
              columns={columns}
              pageSizeOptions={[5, 10, 20]}
              checkboxSelection
              onRowSelectionModelChange={(newSelection) => setSelectionModel(newSelection)}
              rowSelectionModel={selectionModel}
              disableRowSelectionOnClick
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    width: !isMobile,
                    mingauge: !isMobile,
                    maxgauge: !isMobile,
                    minspacing: !isMobile,
                    maxspacing: !isMobile,
                    lhTileWidth: !isMobile,
                  },
                },
              }}
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  bgcolor: '#f5f5f5',
                },
                '& .MuiDataGrid-cell': {
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                },
                '& .MuiDataGrid-toolbarContainer': {
                  p: 1,
                  bgcolor: '#f5f5f5',
                  '& .MuiTextField-root': {
                    width: { xs: '100%', sm: 'auto' },
                  },
                },
              }}
            />
          </Box>

          {/* Recently Uploaded Tiles Section */}
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'medium', color: '#1b75bc' }}>
            Recently Uploaded Tiles
          </Typography>
          {recentlyUploadedTiles.length === 0 ? (
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              No recent tiles available.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
              {recentlyUploadedTiles.map((tile) => (
                <Card
                  key={tile.id}
                  sx={{
                    bgcolor: '#ffffff',
                    boxShadow: 1,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: 3,
                      transform: 'scale(1.02)',
                      cursor: 'pointer',
                    },
                    width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.33% - 11px)' }, // Responsive widths
                  }}
                  onClick={() => handlePersonalTileCalculate(tile)}
                >
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'medium', color: '#1b75bc', mb: 1 }}>
                      {tile.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      Type: {tile.type}
                    </Typography>
                    <Link
                      component="button"
                      underline="hover"
                      sx={{ color: '#1b75bc', fontSize: '0.9rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePersonalTileCalculate(tile);
                      }}
                    >
                      Calculate
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          {/* Favorites Section */}
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'medium', color: '#1b75bc' }}>
            Favorite Tiles
          </Typography>
          {favoriteTiles.length === 0 ? (
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              No favorite tiles yet. Mark tiles as favorites in the table above.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
              {favoriteTiles.map((tile) => (
                <Card
                  key={tile.id}
                  sx={{
                    bgcolor: '#ffffff',
                    boxShadow: 1,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: 3,
                      transform: 'scale(1.02)',
                      cursor: 'pointer',
                    },
                    width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.33% - 11px)' },
                  }}
                  onClick={() => handlePersonalTileCalculate(tile)}
                >
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'medium', color: '#1b75bc', mb: 1 }}>
                      {tile.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      Type: {tile.type}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Link
                        component="button"
                        underline="hover"
                        sx={{ color: '#1b75bc', fontSize: '0.9rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePersonalTileCalculate(tile);
                        }}
                      >
                        Calculate
                      </Link>
                      <Link
                        component="button"
                        underline="hover"
                        sx={{ color: '#1b75bc', fontSize: '0.9rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(tile.id);
                        }}
                      >
                        Remove Favorite
                      </Link>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </>
      )}

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
    </Box>
  );
};

export default PersonalTiles;