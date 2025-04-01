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

interface Project {
  id: number;
  projectName: string;
  createdAt: string;
  updatedAt: string;
}

const SavedProjects: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/api/projects', {
          params: { page, search },
        });
        const fetchedProjects = response.data.projects || [];
        setProjects(fetchedProjects);
        setTotalPages(Math.ceil((response.data.total || 0) / rowsPerPage));

        // Fetch recently updated projects (last 5 by updatedAt)
        const recentResponse = await api.get('/api/projects', {
          params: { page: 1, limit: 5, sort: 'updatedAt', order: 'DESC' },
        });
        setRecentProjects(recentResponse.data.projects || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch projects');
      }
    };
    fetchProjects();

    // Load favorites from localStorage
    const storedFavorites = localStorage.getItem('favoriteProjects');
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

  const handleFavorite = (projectId: number) => {
    const newFavorites = favorites.includes(projectId)
      ? favorites.filter((id) => id !== projectId)
      : [...favorites, projectId];
    setFavorites(newFavorites);
    localStorage.setItem('favoriteProjects', JSON.stringify(newFavorites));
  };

  const handleSelect = (projectId: number) => {
    const newSelected = selected.includes(projectId)
      ? selected.filter((id) => id !== projectId)
      : [...selected, projectId];
    setSelected(newSelected);
  };

  const handleDelete = async (projectId: number) => {
    try {
      await api.delete(`/api/projects/${projectId}`);
      setProjects(projects.filter((project) => project.id !== projectId));
      setRecentProjects(recentProjects.filter((project) => project.id !== projectId));
      setFavorites(favorites.filter((id) => id !== projectId));
      setSelected(selected.filter((id) => id !== projectId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete project');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await api.post('/api/projects/bulk-delete', { projectIds: selected });
      setProjects(projects.filter((project) => !selected.includes(project.id)));
      setRecentProjects(recentProjects.filter((project) => !selected.includes(project.id)));
      setFavorites(favorites.filter((id) => !selected.includes(id)));
      setSelected([]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to bulk delete projects');
    }
  };

  const handleEdit = (projectId: number) => {
    navigate(`/project/edit/${projectId}`);
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
        Saved Projects
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Saved Projects allows you to view and manage your previously saved projects in the RoofGrid UK system. Use the table below to view details, edit, or delete projects, and mark favorites for quick access.
      </Typography>

      <TextField
        label="Search by Project Name"
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
                  checked={selected.length === projects.length && projects.length > 0}
                  onChange={() => {
                    if (selected.length === projects.length) {
                      setSelected([]);
                    } else {
                      setSelected(projects.map((project) => project.id));
                    }
                  }}
                />
              </TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Project Name</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <Checkbox
                    checked={selected.includes(project.id)}
                    onChange={() => handleSelect(project.id)}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(project.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(project.id)}>
                    <DeleteIcon sx={{ color: 'red' }} />
                  </IconButton>
                  <IconButton onClick={() => handleFavorite(project.id)}>
                    {favorites.includes(project.id) ? (
                      <StarIcon sx={{ color: 'gold' }} />
                    ) : (
                      <StarBorderIcon />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell>{project.projectName}</TableCell>
                <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
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
      {recentProjects.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
            Recently Updated Projects
          </Typography>
          {recentProjects.map((project) => (
            <Box key={project.id} sx={{ p: 1, border: '1px solid #e0e0e0', borderRadius: 1, mb: 1 }}>
              <Typography>{project.projectName}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SavedProjects;