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
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Card,
  CardContent,
  Link,
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

interface User {
  id: number;
  email: string;
  role: 'admin' | 'user';
  subscription: 'basic' | 'pro';
  password?: string; // Add password as an optional field
  createdAt?: string;
  updatedAt?: string;
}

const UserManagement: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detect mobile screens (xs to sm)
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]); // Store favorite user IDs
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user',
    subscription: 'basic' as 'basic' | 'pro',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get(`/api/admin/users?search=${encodeURIComponent(search)}`);
        setUsers(response.data.users);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch users');
      }
    };

    fetchUsers();
  }, [search]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteUsersAdmin');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

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

  const handleBulkDelete = () => {
    setOpenBulkDeleteDialog(true);
  };

  const handleToggleFavorite = (userId: number) => {
    const updatedFavorites = favorites.includes(userId)
      ? favorites.filter((id) => id !== userId)
      : [...favorites, userId];
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteUsersAdmin', JSON.stringify(updatedFavorites));
  };

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setOpenDetailsDialog(true);
  };

  const handleDetailsDialogClose = () => {
    setOpenDetailsDialog(false);
    setSelectedUser(null);
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

  const handleBulkDeleteDialogClose = () => {
    setOpenBulkDeleteDialog(false);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      // Remove from favorites if deleted
      if (favorites.includes(selectedUser.id)) {
        const updatedFavorites = favorites.filter((id) => id !== selectedUser.id);
        setFavorites(updatedFavorites);
        localStorage.setItem('favoriteUsersAdmin', JSON.stringify(updatedFavorites));
      }
      setSuccess('User deleted successfully');
      handleDeleteDialogClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleBulkDeleteConfirm = async () => {
    try {
      await api.post('/api/admin/users/bulk-delete', { userIds: selectedUsers });
      setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
      // Remove deleted users from favorites
      const updatedFavorites = favorites.filter((id) => !selectedUsers.includes(id));
      setFavorites(updatedFavorites);
      localStorage.setItem('favoriteUsersAdmin', JSON.stringify(updatedFavorites));
      setSelectedUsers([]);
      setSuccess(`Successfully deleted ${selectedUsers.length} users`);
      handleBulkDeleteDialogClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete users');
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

  // CSV Import Handler
  const handleCSVImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse<User>(file, {
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
      complete: async (result: Papa.ParseResult<User>) => {
        console.log('Parse Result Meta:', result.meta); // Debug log for metadata
        const parsedUsers = result.data as Partial<User>[];
        console.log('Parsed Users:', parsedUsers); // Debug log

        // Filter out empty rows
        const nonEmptyUsers = parsedUsers.filter((user) => user.email && user.role && user.subscription && user.password);
        if (nonEmptyUsers.length === 0) {
          setError('No valid users found in CSV.');
          return;
        }

        const formattedUsers = nonEmptyUsers.map((user) => ({
          email: user.email ? String(user.email).trim() : '',
          password: user.password ? String(user.password).trim() : '',
          role: user.role ? (String(user.role).toLowerCase() as 'user' | 'admin') : 'user',
          subscription: user.subscription ? (String(user.subscription).toLowerCase() as 'basic' | 'pro') : 'basic',
        }));

        console.log('Formatted Users:', formattedUsers); // Debug log

        // Validate the parsed users
        const invalidUsers = formattedUsers.filter(
          (user) =>
            !user.email ||
            !user.password ||
            !user.role ||
            !['user', 'admin'].includes(user.role) ||
            !user.subscription ||
            !['basic', 'pro'].includes(user.subscription)
        );
        if (invalidUsers.length > 0) {
          console.log('Invalid Users:', invalidUsers); // Debug log
          setError('Invalid data in CSV: Ensure all users have email, password, role (user or admin), and subscription (basic or pro).');
          return;
        }

        try {
          const response = await api.post('/api/admin/users/bulk-import', formattedUsers);
          console.log('Backend Response:', response.data); // Debug log
          setUsers([...users, ...response.data]);
          setSuccess(`Successfully imported ${formattedUsers.length} users`);
        } catch (err: any) {
          console.error('Backend Error:', err.response?.data); // Debug log
          setError(err.response?.data?.message || 'Failed to import users');
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

  // Filter users based on search and role
  const filteredUsers = users.filter((user: User) => {
    const matchesSearch = user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole ? user.role === filterRole : true;
    return matchesSearch && matchesRole;
  });

  // Get unique roles for filtering
  const userRoles = Array.from(new Set(users.map((user: User) => user.role)));

  // Get recently updated users
  const recentlyUpdatedUsers = [...users]
    .sort((a: User, b: User) => {
      if (a.updatedAt && b.updatedAt) {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return b.id - a.id; // Fallback to ID if updatedAt is unavailable
    })
    .slice(0, 3);

  // Get favorited users
  const favoriteUsers = users.filter((user: User) => favorites.includes(user.id));

  // Define DataGrid columns with responsive widths
  const columns: GridColDef[] = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => handleEditUser(params.row as User)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteUser(params.row as User)} color="error">
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => handleToggleFavorite(params.row.id)} color="primary">
            {favorites.includes(params.row.id) ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>
        </Box>
      ),
    },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 200, sortable: true },
    { field: 'role', headerName: 'Role', width: 120, sortable: true },
    { field: 'subscription', headerName: 'Subscription', width: 120, sortable: true },
    { field: 'createdAt', headerName: 'Created At', width: 180, sortable: true, type: 'dateTime', valueGetter: ({ value }) => value && new Date(value) },
    { field: 'updatedAt', headerName: 'Updated At', width: 180, sortable: true, type: 'dateTime', valueGetter: ({ value }) => value && new Date(value) },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Page Title and Introduction */}
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
        User Management
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', maxWidth: 800 }}>
        User Management allows admins to oversee the users in the RoofGrid UK system. Use the table below to add, edit, or delete users, import users via CSV, and mark favorites for quick access.
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

      {users.length === 0 ? (
        <Typography align="center" color="text.secondary">
          No users found. Add a new user or import users via CSV.
        </Typography>
      ) : (
        <>
          {/* DataGrid for Managing Users */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Search by Email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ width: { xs: '100%', sm: 200 } }}
                InputLabelProps={{ style: { color: '#1b75bc' } }}
              />
              <FormControl sx={{ width: { xs: '100%', sm: 200 } }}>
                <InputLabel sx={{ color: '#1b75bc' }}>Filter by Role</InputLabel>
                <Select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  label="Filter by Role"
                >
                  <MenuItem value="">All Roles</MenuItem>
                  {userRoles.map((role) => (
                    <MenuItem key={role} value={role}>{role}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {selectedUsers.length > 0 && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleBulkDelete}
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' }, px: { xs: 2, sm: 3 } }}
                >
                  Delete Selected ({selectedUsers.length})
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
                onClick={handleAddUser}
                sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' }, px: { xs: 2, sm: 3 } }}
              >
                Add New User
              </Button>
            </Box>
          </Box>
          <Box sx={{ height: 400, width: '100%', mb: 4 }}>
            <DataGrid
              rows={filteredUsers}
              columns={columns}
              pageSizeOptions={[5, 10, 20]}
              checkboxSelection
              onRowSelectionModelChange={(newSelection: GridRowSelectionModel) => {
                setSelectedUsers(newSelection as number[]);
              }}
              rowSelectionModel={selectedUsers}
              onRowClick={(params, event) => {
                // Prevent row click when clicking on the Actions column
                if ((event.target as HTMLElement).closest('.MuiDataGrid-cell--withRenderer')) return;
                handleRowClick(params.row as User);
              }}
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
                    createdAt: !isMobile,
                    updatedAt: !isMobile,
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
                '& .MuiDataGrid-row': {
                  cursor: 'pointer',
                },
              }}
            />
          </Box>

          {/* Recently Updated Users Section */}
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'medium', color: '#1b75bc' }}>
            Recently Updated Users
          </Typography>
          {recentlyUpdatedUsers.length === 0 ? (
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              No recent users available.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
              {recentlyUpdatedUsers.map((user) => (
                <Card
                  key={user.id}
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
                  onClick={() => handleRowClick(user)}
                >
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'medium', color: '#1b75bc', mb: 1 }}>
                      {user.email}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      Role: {user.role}
                    </Typography>
                    <Link
                      component="button"
                      underline="hover"
                      sx={{ color: '#1b75bc', fontSize: '0.9rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditUser(user);
                      }}
                    >
                      Edit
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          {/* Favorite Users Section */}
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'medium', color: '#1b75bc' }}>
            Favorite Users
          </Typography>
          {favoriteUsers.length === 0 ? (
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              No favorite users yet. Mark users as favorites in the table above.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
              {favoriteUsers.map((user) => (
                <Card
                  key={user.id}
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
                  onClick={() => handleRowClick(user)}
                >
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'medium', color: '#1b75bc', mb: 1 }}>
                      {user.email}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      Role: {user.role}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Link
                        component="button"
                        underline="hover"
                        sx={{ color: '#1b75bc', fontSize: '0.9rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditUser(user);
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
                          handleToggleFavorite(user.id);
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

      {/* User Details Dialog */}
      <Dialog open={openDetailsDialog} onClose={handleDetailsDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          User Details
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Email: {selectedUser?.email}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 250, backgroundColor: 'grey.200' }}>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: 0.5 }}>Email</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, fontWeight: 'bold', py: 0.5 }}>
                      {selectedUser.email}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: 0.5 }}>Role</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, fontWeight: 'bold', py: 0.5 }}>
                      {selectedUser.role}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: 0.5 }}>Subscription</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, fontWeight: 'bold', py: 0.5 }}>
                      {selectedUser.subscription}
                    </TableCell>
                  </TableRow>
                  {selectedUser.createdAt && (
                    <TableRow>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: 0.5 }}>Created At</TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, fontWeight: 'bold', py: 0.5 }}>
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  )}
                  {selectedUser.updatedAt && (
                    <TableRow>
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, py: 0.5 }}>Updated At</TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, fontWeight: 'bold', py: 0.5 }}>
                        {new Date(selectedUser.updatedAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailsDialogClose} color="secondary">
            Close
          </Button>
          {selectedUser && (
            <Button onClick={() => handleEditUser(selectedUser)} color="primary">
              Edit User
            </Button>
          )}
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

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={openBulkDeleteDialog} onClose={handleBulkDeleteDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Bulk Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedUsers.length} users?
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

export default UserManagement;