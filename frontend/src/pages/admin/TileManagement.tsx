import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Box,
  Typography,
  Alert,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Link,
  IconButton,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import api from '../../services/api';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Papa from 'papaparse';

interface Tile {
  id: number;
  name: string;
  type: string;
  length: number;
  width: number;
  crossbonded: 'YES' | 'NO';
  mingauge: number;
  maxgauge: number;
  minspacing: number;
  maxspacing: number;
  lhTileWidth: number;
  createdAt?: string;
}

const TileManagement: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detect mobile screens (xs to sm)
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]); // Store favorite tile IDs
  const [newTile, setNewTile] = useState({
    name: '',
    type: '',
    length: 0,
    width: 0,
    crossbonded: 'NO' as 'YES' | 'NO',
    mingauge: 75,
    maxgauge: 325,
    minspacing: 3,
    maxspacing: 7,
    lhTileWidth: 0,
  });
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    const fetchTiles = async () => {
      try {
        const response = await api.get('/api/tiles');
        const tilesWithNormalizedType = response.data.map((tile: Tile) => ({
          ...tile,
          type: normalizeTileType(tile.type),
        }));
        setTiles(tilesWithNormalizedType);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch tiles');
      }
    };

    fetchTiles();
  }, []);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteTilesAdmin');
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
      case 'pantile':
        return 'Pantile';
      default:
        return type;
    }
  };

  const handleAddTile = () => {
    setNewTile({
      name: '',
      type: '',
      length: 0,
      width: 0,
      crossbonded: 'NO',
      mingauge: 75,
      maxgauge: 325,
      minspacing: 3,
      maxspacing: 7,
      lhTileWidth: 0,
    });
    setOpenAddDialog(true);
  };

  const handleEditTile = (tile: Tile) => {
    setSelectedTile(tile);
    setOpenEditDialog(true);
  };

  const handleDeleteTile = (tile: Tile) => {
    setSelectedTile(tile);
    setOpenDeleteDialog(true);
  };

  const handleBulkDelete = () => {
    setOpenBulkDeleteDialog(true);
  };

  const handleToggleFavorite = (tileId: number) => {
    const updatedFavorites = favorites.includes(tileId)
      ? favorites.filter((id) => id !== tileId)
      : [...favorites, tileId];
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteTilesAdmin', JSON.stringify(updatedFavorites));
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setSelectedTile(null);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setSelectedTile(null);
  };

  const handleBulkDeleteDialogClose = () => {
    setOpenBulkDeleteDialog(false);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tileToAdd = { ...newTile, type: normalizeTileType(newTile.type) };
      const response = await api.post('/api/tiles', tileToAdd);
      setTiles([...tiles, { ...response.data, type: normalizeTileType(response.data.type) }]);
      setSuccess('Tile added successfully');
      handleAddDialogClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add tile');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTile) return;

    try {
      const tileToUpdate = { ...selectedTile, type: normalizeTileType(selectedTile.type) };
      const response = await api.put(`/api/tiles/${selectedTile.id}`, tileToUpdate);
      setTiles(tiles.map((tile) => (tile.id === selectedTile.id ? { ...response.data, type: normalizeTileType(response.data.type) } : tile)));
      setSuccess('Tile updated successfully');
      handleEditDialogClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update tile');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTile) return;

    try {
      await api.delete(`/api/tiles/${selectedTile.id}`);
      setTiles(tiles.filter((tile) => tile.id !== selectedTile.id));
      // Remove from favorites if deleted
      if (favorites.includes(selectedTile.id)) {
        const updatedFavorites = favorites.filter((id) => id !== selectedTile.id);
        setFavorites(updatedFavorites);
        localStorage.setItem('favoriteTilesAdmin', JSON.stringify(updatedFavorites));
      }
      setSuccess('Tile deleted successfully');
      handleDeleteDialogClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete tile');
    }
  };

  const handleBulkDeleteConfirm = async () => {
    try {
      await api.post('/api/tiles/bulk-delete', { tileIds: selectedTiles });
      setTiles(tiles.filter((tile) => !selectedTiles.includes(tile.id)));
      // Remove deleted tiles from favorites
      const updatedFavorites = favorites.filter((id) => !selectedTiles.includes(id));
      setFavorites(updatedFavorites);
      localStorage.setItem('favoriteTilesAdmin', JSON.stringify(updatedFavorites));
      setSelectedTiles([]);
      setSuccess(`Successfully deleted ${selectedTiles.length} tiles`);
      handleBulkDeleteDialogClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete tiles');
    }
  };

  const handleNewTileChange = (field: keyof typeof newTile, value: string | number) => {
    setNewTile({ ...newTile, [field]: value });
  };

  const handleTileChange = (field: keyof Tile, value: string | number) => {
    if (selectedTile) {
      setSelectedTile({ ...selectedTile, [field]: value });
    }
  };

  // CSV Import Handler
  const handleCSVImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse<Tile>(file, {
      header: true,
      skipEmptyLines: true,
      delimiter: ',', // Explicitly specify comma as delimiter
      dynamicTyping: true, // Automatically convert numerical fields to numbers
      transform: (value, field) => {
        // Trim whitespace from string fields
        if (typeof value === 'string') {
          return value.trim();
        }
        return value;
      },
      complete: async (result: Papa.ParseResult<Tile>) => {
        console.log('Parse Result Meta:', result.meta); // Debug log for metadata
        const parsedTiles = result.data as Partial<Tile>[];
        console.log('Parsed Tiles:', parsedTiles); // Debug log

        // Filter out empty rows
        const nonEmptyTiles = parsedTiles.filter((tile) => tile.name && tile.type);
        if (nonEmptyTiles.length === 0) {
          setError('No valid tiles found in CSV.');
          return;
        }

        const formattedTiles = nonEmptyTiles.map((tile) => ({
          name: tile.name ? String(tile.name).trim() : '',
          type: tile.type ? normalizeTileType(String(tile.type).trim()) : '',
          length: Number(tile.length) || 0,
          width: Number(tile.width) || 0,
          crossbonded: tile.crossbonded ? (String(tile.crossbonded).toUpperCase() as 'YES' | 'NO') : 'NO',
          mingauge: Number(tile.mingauge) || 75,
          maxgauge: Number(tile.maxgauge) || 325,
          minspacing: Number(tile.minspacing) || 3,
          maxspacing: Number(tile.maxspacing) || 7,
          lhTileWidth: Number(tile.lhTileWidth) || 0,
        }));

        console.log('Formatted Tiles:', formattedTiles); // Debug log

        // Validate the parsed tiles
        const invalidTiles = formattedTiles.filter(
          (tile) => !tile.name || !tile.type || tile.length <= 0 || tile.width <= 0
        );
        if (invalidTiles.length > 0) {
          console.log('Invalid Tiles:', invalidTiles); // Debug log
          setError('Invalid data in CSV: Ensure all tiles have name, type, length, and width.');
          return;
        }

        try {
          const response = await api.post('/api/tiles/bulk-import', formattedTiles);
          setTiles([...tiles, ...response.data]);
          setSuccess(`Successfully imported ${formattedTiles.length} tiles`);
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to import tiles');
        }
      },
      error: (error: Error) => {
        setError('Failed to parse CSV file: ' + error.message);
      },
    });

    // Reset the file input
    if (event.target) {
      event.target.value = '';
    }
  };

  // Define DataGrid columns with responsive widths
  const columns: GridColDef[] = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => handleEditTile(params.row as Tile)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteTile(params.row as Tile)} color="error">
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => handleToggleFavorite(params.row.id)} color="primary">
            {favorites.includes(params.row.id) ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>
        </Box>
      ),
    },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150, sortable: true },
    { field: 'type', headerName: 'Type', flex: 1, minWidth: 120, sortable: true },
    { field: 'length', headerName: 'Length', width: 100, sortable: true, type: 'number' },
    { field: 'width', headerName: 'Width', width: 100, sortable: true, type: 'number' },
    { field: 'crossbonded', headerName: 'Crossbonded', width: 120, sortable: true },
    { field: 'mingauge', headerName: 'Min Gauge', width: 100, sortable: true, type: 'number' },
    { field: 'maxgauge', headerName: 'Max Gauge', width: 100, sortable: true, type: 'number' },
    { field: 'minspacing', headerName: 'Min Spacing', width: 100, sortable: true, type: 'number' },
    { field: 'maxspacing', headerName: 'Max Spacing', width: 100, sortable: true, type: 'number' },
    { field: 'lhTileWidth', headerName: 'LH Tile Width', width: 120, sortable: true, type: 'number' },
  ];

  // Filter tiles based on search and type
  const filteredTiles = tiles.filter((tile: Tile) => {
    const matchesSearch = tile.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType ? tile.type === filterType : true;
    return matchesSearch && matchesType;
  });

  // Get unique tile types for filtering
  const tileTypes = Array.from(new Set(tiles.map((tile: Tile) => tile.type)));

  // Get recently uploaded tiles
  const recentlyUploadedTiles = [...tiles]
    .sort((a: Tile, b: Tile) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return b.id - a.id; // Fallback to ID if createdAt is unavailable
    })
    .slice(0, 3);

  // Get favorited tiles
  const favoriteTiles = tiles.filter((tile: Tile) => favorites.includes(tile.id));

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Page Title and Introduction */}
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
        Tile Management
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', maxWidth: 800 }}>
        Tile Management allows admins to oversee the default tiles available in the RoofGrid UK system. Use the table below to add, edit, or delete tiles, import tiles via CSV, and mark favorites for quick access.
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

      {tiles.length === 0 ? (
        <Typography align="center" color="text.secondary">
          No tiles found. Add a new tile or import tiles via CSV.
        </Typography>
      ) : (
        <>
          {/* DataGrid for Managing Tiles */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Search by Name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ width: { xs: '100%', sm: 200 } }}
                InputLabelProps={{ style: { color: '#1b75bc' } }}
              />
              <FormControl sx={{ width: { xs: '100%', sm: 200 } }}>
                <InputLabel sx={{ color: '#1b75bc' }}>Filter by Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  label="Filter by Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  {tileTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {selectedTiles.length > 0 && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleBulkDelete}
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' }, px: { xs: 2, sm: 3 } }}
                >
                  Delete Selected ({selectedTiles.length})
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                component="label"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' }, px: { xs: 2, sm: 3 } }}
              >
                Import CSV
                <input type="file" accept=".csv" hidden onChange={handleCSVImport} />
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddTile}
                sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' }, px: { xs: 2, sm: 3 } }}
              >
                Add New Tile
              </Button>
            </Box>
          </Box>
          <Box sx={{ height: 400, width: '100%', mb: 4 }}>
            <DataGrid
              rows={filteredTiles}
              columns={columns}
              pageSizeOptions={[5, 10, 20]}
              checkboxSelection
              onRowSelectionModelChange={(newSelection: GridRowSelectionModel) => {
                setSelectedTiles(newSelection as number[]);
              }}
              rowSelectionModel={selectedTiles}
              disableRowSelectionOnClick
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                  csvOptions: {
                    fields: columns
                      .filter((col) => col.field !== 'actions') // Exclude the actions column
                      .map((col) => col.field),
                  },
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
                    width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.33% - 11px)' },
                  }}
                  onClick={() => handleEditTile(tile)}
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
                        handleEditTile(tile);
                      }}
                    >
                      Edit
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
                  onClick={() => handleEditTile(tile)}
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
                          handleEditTile(tile);
                        }}
                      >
                        Edit
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

      {/* Add New Tile Dialog */}
      <Dialog open={openAddDialog} onClose={handleAddDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Tile</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleAddSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  value={newTile.name}
                  onChange={(e) => handleNewTileChange('name', e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Type"
                  value={newTile.type}
                  onChange={(e) => handleNewTileChange('type', e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Length"
                  type="number"
                  value={newTile.length}
                  onChange={(e) => handleNewTileChange('length', parseInt(e.target.value))}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Width"
                  type="number"
                  value={newTile.width}
                  onChange={(e) => handleNewTileChange('width', parseInt(e.target.value))}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Crossbonded</InputLabel>
                  <Select
                    value={newTile.crossbonded}
                    onChange={(e) => handleNewTileChange('crossbonded', e.target.value as 'YES' | 'NO')}
                    required
                  >
                    <MenuItem value="YES">YES</MenuItem>
                    <MenuItem value="NO">NO</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Min Gauge"
                  type="number"
                  value={newTile.mingauge}
                  onChange={(e) => handleNewTileChange('mingauge', parseInt(e.target.value))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Max Gauge"
                  type="number"
                  value={newTile.maxgauge}
                  onChange={(e) => handleNewTileChange('maxgauge', parseInt(e.target.value))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Min Spacing"
                  type="number"
                  value={newTile.minspacing}
                  onChange={(e) => handleNewTileChange('minspacing', parseInt(e.target.value))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Max Spacing"
                  type="number"
                  value={newTile.maxspacing}
                  onChange={(e) => handleNewTileChange('maxspacing', parseInt(e.target.value))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="LH Tile Width"
                  type="number"
                  value={newTile.lhTileWidth}
                  onChange={(e) => handleNewTileChange('lhTileWidth', parseInt(e.target.value))}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Tile Dialog */}
      <Dialog open={openEditDialog} onClose={handleEditDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Tile</DialogTitle>
        <DialogContent>
          {selectedTile && (
            <Box component="form" onSubmit={handleEditSubmit} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Name"
                    value={selectedTile.name}
                    onChange={(e) => handleTileChange('name', e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Type"
                    value={selectedTile.type}
                    onChange={(e) => handleTileChange('type', e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Length"
                    type="number"
                    value={selectedTile.length}
                    onChange={(e) => handleTileChange('length', parseInt(e.target.value))}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Width"
                    type="number"
                    value={selectedTile.width}
                    onChange={(e) => handleTileChange('width', parseInt(e.target.value))}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Crossbonded</InputLabel>
                    <Select
                      value={selectedTile.crossbonded}
                      onChange={(e) => handleTileChange('crossbonded', e.target.value as 'YES' | 'NO')}
                      required
                    >
                      <MenuItem value="YES">YES</MenuItem>
                      <MenuItem value="NO">NO</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Min Gauge"
                    type="number"
                    value={selectedTile.mingauge}
                    onChange={(e) => handleTileChange('mingauge', parseInt(e.target.value))}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Max Gauge"
                    type="number"
                    value={selectedTile.maxgauge}
                    onChange={(e) => handleTileChange('maxgauge', parseInt(e.target.value))}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Min Spacing"
                    type="number"
                    value={selectedTile.minspacing}
                    onChange={(e) => handleTileChange('minspacing', parseInt(e.target.value))}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Max Spacing"
                    type="number"
                    value={selectedTile.maxspacing}
                    onChange={(e) => handleTileChange('maxspacing', parseInt(e.target.value))}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="LH Tile Width"
                    type="number"
                    value={selectedTile.lhTileWidth}
                    onChange={(e) => handleTileChange('lhTileWidth', parseInt(e.target.value))}
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the tile {selectedTile?.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={openBulkDeleteDialog} onClose={handleBulkDeleteDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Bulk Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedTiles.length} tiles?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBulkDeleteDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleBulkDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TileManagement;