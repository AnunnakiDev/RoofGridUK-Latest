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
  Pagination,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../services/api';

interface User {
  id: number;
  email: string;
  role: 'admin' | 'user';
  subscription: 'basic' | 'pro';
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sectionExpanded, setSectionExpanded] = useState<boolean>(true);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user',
    subscription: 'basic' as 'basic' | 'pro',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [search, setSearch] = useState(''); // Add search state
  const limit = 10; // Number of users per page

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get(`/api/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
        setTotalUsers(response.data.totalUsers);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch users');
      }
    };

    fetchUsers();
  }, [page, search]); // Add search to dependencies

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleAddUser = () => {
    setNewUser({
      email: '',
      password: '',
      role: 'user',
      subscription: 'basic',
    });
    setOpenAddDialog(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setOpenEditDialog(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
    setNewUser({
      email: '',
      password: '',
      role: 'user',
      subscription: 'basic',
    });
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setSelectedUser(null);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setSelectedUser(null);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/admin/users', newUser);
      setUsers([...users, response.data]);
      setSuccess('User created successfully');
      handleAddDialogClose();
      // Refresh the user list
      const fetchResponse = await api.get(`/api/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
      setUsers(fetchResponse.data.users);
      setTotalPages(fetchResponse.data.totalPages);
      setTotalUsers(fetchResponse.data.totalUsers);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const response = await api.put(`/api/admin/users/${selectedUser.id}`, {
        role: selectedUser.role,
        subscription: selectedUser.subscription,
      });
      setUsers(users.map((user) => (user.id === selectedUser.id ? response.data : user)));
      setSuccess('User updated successfully');
      handleEditDialogClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      await api.delete(`/api/admin/users/${selectedUser.id}`);
      setUsers(users.filter((user) => user.id !== selectedUser.id));
      setSuccess('User deleted successfully');
      handleDeleteDialogClose();
      // Refresh the user list
      const fetchResponse = await api.get(`/api/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
      setUsers(fetchResponse.data.users);
      setTotalPages(fetchResponse.data.totalPages);
      setTotalUsers(fetchResponse.data.totalUsers);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleNewUserChange = (field: keyof typeof newUser, value: string) => {
    setNewUser({ ...newUser, [field]: value });
  };

  const handleUserChange = (field: keyof User, value: string) => {
    if (selectedUser) {
      setSelectedUser({ ...selectedUser, [field]: value });
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
            User Management
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', sm: 'center' },
              mb: 2,
              px: { xs: 1, sm: 0 },
              gap: 2,
            }}
          >
            <TextField
              label="Search by Email"
              value={search}
              onChange={handleSearchChange}
              fullWidth
              sx={{ maxWidth: { xs: '100%', sm: 300 } }}
              InputLabelProps={{ style: { color: '#1b75bc' } }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1">
                Total Users: {totalUsers}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddUser}
                sx={{
                  py: 1,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  width: { xs: 'auto', sm: 'auto' },
                }}
              >
                Add New User
              </Button>
            </Box>
          </Box>
          {users.length === 0 ? (
            <Typography align="center" color="text.secondary">
              No users found.
            </Typography>
          ) : (
            <>
              <Box sx={{ overflowX: 'auto' }}>
                {users.map((user) => (
                  <Accordion key={user.id} sx={{ mb: 1 }} defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 'medium', color: 'primary.main', fontSize: { xs: '0.9rem', sm: '1.1rem' } }}
                        >
                          {user.email}
                        </Typography>
                        <Box>
                          <IconButton onClick={(e) => { e.stopPropagation(); handleEditUser(user); }} color="primary">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={(e) => { e.stopPropagation(); handleDeleteUser(user); }} color="error">
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
                              <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Email</TableCell>
                              <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                {user.email}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Role</TableCell>
                              <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                {user.role}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 0.25 }}>Subscription</TableCell>
                              <TableCell sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, fontWeight: 'bold', py: 0.25 }}>
                                {user.subscription}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#1b75bc',
                    },
                    '& .Mui-selected': {
                      bgcolor: '#1b75bc',
                      color: 'white',
                    },
                  }}
                />
              </Box>
            </>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Add New User Dialog */}
      <Dialog open={openAddDialog} onClose={handleAddDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleAddSubmit} sx={{ mt: 2 }}>
            <TextField
              label="Email"
              value={newUser.email}
              onChange={(e) => handleNewUserChange('email', e.target.value)}
              fullWidth
              margin="normal"
              required
              type="email"
            />
            <TextField
              label="Password"
              value={newUser.password}
              onChange={(e) => handleNewUserChange('password', e.target.value)}
              fullWidth
              margin="normal"
              required
              type="password"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                value={newUser.role}
                onChange={(e) => handleNewUserChange('role', e.target.value)}
                required
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Subscription</InputLabel>
              <Select
                value={newUser.subscription}
                onChange={(e) => handleNewUserChange('subscription', e.target.value)}
                required
              >
                <MenuItem value="basic">Basic</MenuItem>
                <MenuItem value="pro">Pro</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddSubmit} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={handleEditDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box component="form" onSubmit={handleEditSubmit} sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Email: {selectedUser.email}
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  value={selectedUser.role}
                  onChange={(e) => handleUserChange('role', e.target.value)}
                  required
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Subscription</InputLabel>
                <Select
                  value={selectedUser.subscription}
                  onChange={(e) => handleUserChange('subscription', e.target.value)}
                  required
                >
                  <MenuItem value="basic">Basic</MenuItem>
                  <MenuItem value="pro">Pro</MenuItem>
                </Select>
              </FormControl>
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
            Are you sure you want to delete the user {selectedUser?.email}?
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
    </>
  );
};

export default UserManagement;