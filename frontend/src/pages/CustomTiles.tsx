import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../services/api';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Checkbox,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface CustomTile {
  id: number;
  name: string;
  type: string;
  length: number;
  width: number;
  createdAt: string;
  updatedAt: string;
}

const CustomTiles: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [tiles, setTiles] = useState<CustomTile[]>([]);
  const [recentTiles, setRecentTiles] = useState<CustomTile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchTiles = async () => {
      try {
        const response = await api.get('/api/user-tiles/tiles', {
          params: { page, search },
        });
        const fetchedTiles = response.data.tiles || [];
        setTiles(fetchedTiles);
        setTotalPages(Math.ceil((response.data.total || 0) / rowsPerPage));

        // Fetch recently updated tiles (last 5 by updatedAt)
        const recentResponse = await api.get('/api/user-tiles/tiles', {
          params: { page: 1, limit: 5, sort: 'updatedAt', order: 'DESC' },
        });
        setRecentTiles(recentResponse.data.tiles || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch custom tiles');
      }
    };
    fetchTiles();

    // Load favorites from localStorage
    const storedFavorites = localStorage.getItem('favoriteTiles');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, [page, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleFavorite = (tileId: number) => {
    const newFavorites = favorites.includes(tileId)
      ? favorites.filter((id) => id !== tileId)
      : [...favorites, tileId];
    setFavorites(newFavorites);
    localStorage.setItem('favoriteTiles', JSON.stringify(newFavorites));
  };

  const handleSelect = (tileId: number) => {
    const newSelected = selected.includes(tileId)
      ? selected.filter((id) => id !== tileId)
      : [...selected, tileId];
    setSelected(newSelected);
  };

  const handleDelete = async (tileId: number) => {
    try {
      await api.delete(`/api/user-tiles/tiles/${tileId}`);
      setTiles(tiles.filter((tile) => tile.id !== tileId));
      setRecentTiles(recentTiles.filter((tile) => tile.id !== tileId));
      setFavorites(favorites.filter((id) => id !== tileId));
      setSelected(selected.filter((id) => id !== tileId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete tile');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await api.post('/api/user-tiles/tiles/bulk-delete', { tileIds: selected });
      setTiles(tiles.filter((tile) => !selected.includes(tile.id)));
      setRecentTiles(recentTiles.filter((tile) => !selected.includes(tile.id)));
      setFavorites(favorites.filter((id) => !selected.includes(id)));
      setSelected([]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to bulk delete tiles');
    }
  };

  const handleEdit = (tileId: number) => {
    navigate(`/custom-tiles/edit/${tileId}`);
  };

  const handleRecentTileClick = (tileId: number) => {
    navigate(`/custom-tiles/edit/${tileId}`);
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
        Custom Tiles
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Custom Tiles allows you to view and manage your previously saved tiles in the RoofGrid UK system. Use the table below to view details, edit, or delete tiles, and mark favorites for quick access.
      </Typography>

      <TextField
        label="Search by Tile Name"
        value={search}
        onChange={handleSearchChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          {selected.length > 0 && (
            <Button
              variant="contained"
              color="error"
              onClick={handleBulkDelete}
              sx={{ mr: 1 }}
            >
              Delete Selected
            </Button>
          )}
        </Box>
        <Box>
          <Button sx={{ mx: 1 }}>Columns</Button>
          <Button sx={{ mx: 1 }}>Filters</Button>
          <Button sx={{ mx: 1 }}>Density</Button>
          <Button sx={{ mx: 1 }}>Export</Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={selected.length === tiles.length && tiles.length > 0}
                  onChange={() => {
                    if (selected.length === tiles.length) {
                      setSelected([]);
                    } else {
                      setSelected(tiles.map((tile) => tile.id));
                    }
                  }}
                />
              </TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Length</TableCell>
              <TableCell>Width</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tiles.map((tile) => (
              <TableRow key={tile.id}>
                <TableCell>
                  <Checkbox
                    checked={selected.includes(tile.id)}
                    onChange={() => handleSelect(tile.id)}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(tile.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(tile.id)}>
                    <DeleteIcon sx={{ color: 'red' }} />
                  </IconButton>
                  <IconButton onClick={() => handleFavorite(tile.id)}>
                    {favorites.includes(tile.id) ? (
                      <StarIcon sx={{ color: 'gold' }} />
                    ) : (
                      <StarBorderIcon />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell>{tile.name}</TableCell>
                <TableCell>{tile.type}</TableCell>
                <TableCell>{tile.length}</TableCell>
                <TableCell>{tile.width}</TableCell>
                <TableCell>{new Date(tile.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
        />
      </Box>
      {recentTiles.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
            Recently Updated Tiles
          </Typography>
          {recentTiles.map((tile) => (
            <Box
              key={tile.id}
              sx={{
                p: 1,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                mb: 1,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: '#f5f5f5',
                },
              }}
              onClick={() => handleRecentTileClick(tile.id)}
            >
              <Typography>{tile.name}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CustomTiles;