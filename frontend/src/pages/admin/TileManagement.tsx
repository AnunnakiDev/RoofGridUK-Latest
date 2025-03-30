import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import api from '../../services/api';

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
}

const TileManagement: React.FC = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
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
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchTiles = async () => {
      try {
        const response = await api.get('/api/tiles');
        setTiles(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch tiles');
      }
    };

    fetchTiles();
  }, []);

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
      const response = await api.post('/api/tiles', newTile);
      setTiles([...tiles, response.data]);
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
      const response = await api.put(`/api/tiles/${selectedTile.id}`, selectedTile);
      setTiles(tiles.map((tile) => (tile.id === selectedTile.id ? response.data : tile)));
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

  // Define DataGrid columns with responsive widths
  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150, sortable: true },
    { field: 'type', headerName: 'Type', flex: 1, minWidth: 120, sortable: true },
    { field: 'length', headerName: 'Length', width: 100, sortable: true },
    { field: 'width', headerName: 'Width', width: 100, sortable: true },
    { field: 'crossbonded', headerName: 'Crossbonded', width: 120, sortable: true },
    { field: 'mingauge', headerName: 'Min Gauge', width: 100, sortable: true },
    { field: 'maxgauge', headerName: 'Max Gauge', width: 100, sortable: true },
    { field: 'minspacing', headerName: 'Min Spacing', width: 100, sortable: true },
    { field: 'maxspacing', headerName: 'Max Spacing', width: 100, sortable: true },
    { field: 'lhTileWidth', headerName: 'LH Tile Width', width: 120, sortable: true },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color="primary"
            onClick={() => handleEditTile(params.row as Tile)}
          >
            Edit
          </Button>
          <Button
            color="error"
            onClick={() => handleDeleteTile(params.row as Tile)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  // Filter tiles based on search and type
  const filteredTiles = tiles.filter((tile) => {
    const matchesSearch = tile.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType ? tile.type === filterType : true;
    return matchesSearch && matchesType;
  });

  // Get unique tile types for filtering
  const tileTypes = Array.from(new Set(tiles.map((tile) => tile.type)));

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
        pt: { xs: '80px', sm: '100px' }, // Account for fixed navbar
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2, width: '100%', maxWidth: 800, mx: 'auto' }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2, width: '100%', maxWidth: 800, mx: 'auto' }}>
          {success}
        </Alert>
      )}
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 'bold',
          color: '#1b75bc',
          textAlign: { xs: 'center', sm: 'left' },
        }}
      >
        Tile Management
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          mb: 3,
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            flex: 1,
            width: { xs: '100%', sm: 'auto' },
          }}
        >
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
        <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
          {selectedTiles.length > 0 && (
            <Button
              variant="contained"
              color="error"
              onClick={handleBulkDelete}
              sx={{ py: 1, fontSize: { xs: '0.9rem', sm: '1rem' }, width: { xs: '100%', sm: 'auto' } }}
            >
              Delete Selected ({selectedTiles.length})
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddTile}
            sx={{ py: 1, fontSize: { xs: '0.9rem', sm: '1rem' }, width: { xs: '100%', sm: 'auto' } }}
          >
            Add New Tile
          </Button>
        </Box>
      </Box>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={filteredTiles}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          pageSizeOptions={[10, 20, 50]}
          checkboxSelection
          onRowSelectionModelChange={(newSelection: GridRowSelectionModel) => {
            setSelectedTiles(newSelection as number[]);
          }}
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#1b75bc',
              color: 'white',
            },
            '& .MuiDataGrid-cell': {
              color: 'text.primary',
            },
            '& .MuiDataGrid-root': {
              border: '1px solid #e0e0e0',
            },
            // Ensure horizontal scroll on mobile
            '& .MuiDataGrid-main': {
              overflowX: 'auto',
            },
          }}
        />
      </Box>

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