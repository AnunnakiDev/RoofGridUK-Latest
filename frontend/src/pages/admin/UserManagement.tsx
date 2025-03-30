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
  const [sectionExpanded, setSectionExpanded] = useState<boolean>(true); // Open by default
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
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/api/admin/users');
        setUsers(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password) return 'Password is required';
    if (!passwordRegex.test(password)) {
      return 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }
    return undefined;
  };

  const handleAddUser = () => {
    setNewUser({
      email: '',
      password: '',
      role: 'user',
      subscription: 'basic',
    });
    setFormErrors({});
    setOpenAddDialog(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormErrors({});
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
    setFormErrors({});
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setSelectedUser(null);
    setFormErrors({});
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setSelectedUser(null);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const emailError = validateEmail(newUser.email);
    const passwordError = validatePassword(newUser.password);
    if (emailError || passwordError) {
      setFormErrors({
        email: emailError,
        password: passwordError,
      });
      return;
    }

    try {
      const response = await api.post('/api/admin/users', newUser);
      setUsers([...users, response.data]);
      setSuccess('User created successfully');
      handleAddDialogClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    // Validate email (in case it was edited)
    const emailError = validateEmail(selectedUser.email);
    if (emailError) {
      setFormErrors({ email: emailError });
      return;
    }

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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleNewUserChange = (field: keyof typeof newUser, value: string) => {
    setNewUser({ ...newUser, [field]: value });
    // Clear error for the field being edited
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleUserChange = (field: keyof User, value: string) => {
    if (selectedUser) {
      setSelectedUser({ ...selectedUser, [field]: value });
      // Clear error for the field being edited
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
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
              justifyContent: 'flex-end',
              mb: 2,
              px: { xs: 1, sm: 0 },
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddUser}
              sx={{
                py: 1,
                fontSize: { xs: '0.9rem', sm: '1rem' },
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              Add New User
            </Button>
          </Box>
          {users.length === 0 ? (
            <Typography align="center" color="text.secondary">
              No users found.
            </Typography>
          ) : (
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
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
            <TextField
              label="Password"
              value={newUser.password}
              onChange={(e) => handleNewUserChange('password', e.target.value)}
              fullWidth
              margin="normal"
              required
              type="password"
              error={!!formErrors.password}
              helperText={formErrors.password}
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
              <TextField
                label="Email"
                value={selectedUser.email}
                onChange={(e) => handleUserChange('email', e.target.value)}
                fullWidth
                margin="normal"
                required
                type="email"
                error={!!formErrors.email}
                helperText={formErrors.email}
                disabled // Prevent editing email to avoid complexity with uniqueness constraints
              />
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