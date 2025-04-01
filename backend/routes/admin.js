const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { user: User, project: Project, tile: Tile, userTile: UserTile } = require('../db');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

// Middleware to ensure only admins can access these routes
const checkAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// GET /admin/users - Fetch all users
router.get('/users', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const { search } = req.query;
    let whereClause = {};
    if (search) {
      whereClause = {
        email: {
          [Op.iLike]: `%${search}%`, // Case-insensitive search
        },
      };
    }

    const users = await User.findAll({ where: whereClause });
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// POST /admin/users - Create a new user
router.post('/users', authenticateToken, checkAdmin, async (req, res) => {
  const { email, password, role, subscription } = req.body;

  try {
    console.log(`Received request to create user by admin ${req.user.id}:`, req.body);

    // Validate required fields
    if (!email || !password || !role || !subscription) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({
        message: 'Missing required fields',
        missing: {
          email: !email,
          password: !password,
          role: !role,
          subscription: !subscription,
        },
      });
    }

    // Validate role value
    if (!['user', 'admin'].includes(role)) {
      console.log('Validation failed: Invalid role value:', role);
      return res.status(400).json({ message: 'Role must be "user" or "admin"' });
    }

    // Validate subscription value
    if (!['basic', 'pro'].includes(subscription)) {
      console.log('Validation failed: Invalid subscription value:', subscription);
      return res.status(400).json({ message: 'Subscription must be "basic" or "pro"' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      role,
      subscription,
    });

    console.log('Created new user successfully:', newUser.id);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// PUT /admin/users/:id - Update a user
router.put('/users/:id', authenticateToken, checkAdmin, async (req, res) => {
  const { id } = req.params;
  const { role, subscription } = req.body;

  try {
    console.log(`Received request to update user ${id} by admin ${req.user.id}:`, req.body);

    // Validate required fields
    if (!role || !subscription) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({
        message: 'Missing required fields',
        missing: {
          role: !role,
          subscription: !subscription,
        },
      });
    }

    // Validate role value
    if (!['user', 'admin'].includes(role)) {
      console.log('Validation failed: Invalid role value:', role);
      return res.status(400).json({ message: 'Role must be "user" or "admin"' });
    }

    // Validate subscription value
    if (!['basic', 'pro'].includes(subscription)) {
      console.log('Validation failed: Invalid subscription value:', subscription);
      return res.status(400).json({ message: 'Subscription must be "basic" or "pro"' });
    }

    const existingUser = await User.findOne({ where: { id } });
    if (!existingUser) {
      console.log('User not found:', id);
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await User.update(
      { role, subscription },
      { where: { id }, returning: true }
    );

    if (updatedUser[0] === 0) {
      console.log('User update failed, no rows affected:', id);
      return res.status(500).json({ message: 'Failed to update user' });
    }

    console.log('Updated user successfully:', updatedUser[1][0].toJSON());
    res.json(updatedUser[1][0]);
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// DELETE /admin/users/:id - Delete a user
router.delete('/users/:id', authenticateToken, checkAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`Received request to delete user ${id} by admin ${req.user.id}`);

    const existingUser = await User.findOne({ where: { id } });
    if (!existingUser) {
      console.log('User not found:', id);
      return res.status(404).json({ message: 'User not found' });
    }

    const result = await User.destroy({ where: { id } });

    if (result === 0) {
      console.log('User deletion failed, no rows affected:', id);
      return res.status(500).json({ message: 'Failed to delete user' });
    }

    console.log('Deleted user successfully:', id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// POST /admin/users/bulk-delete - Delete multiple users
router.post('/users/bulk-delete', authenticateToken, checkAdmin, async (req, res) => {
  const { userIds } = req.body;

  try {
    console.log(`Received request to bulk delete users by admin ${req.user.id}:`, userIds);

    // Validate request body
    if (!Array.isArray(userIds) || userIds.length === 0) {
      console.log('Validation failed: userIds must be a non-empty array');
      return res.status(400).json({ message: 'userIds must be a non-empty array' });
    }

    // Check if all users exist
    const existingUsers = await User.findAll({
      where: { id: userIds },
    });

    if (existingUsers.length !== userIds.length) {
      console.log('Some users not found:', userIds);
      return res.status(404).json({ message: 'One or more users not found' });
    }

    // Delete the users
    const result = await User.destroy({
      where: { id: userIds },
    });

    if (result === 0) {
      console.log('Bulk deletion failed, no rows affected');
      return res.status(500).json({ message: 'Failed to delete users' });
    }

    console.log(`Successfully deleted ${result} users`);
    res.json({ message: `Successfully deleted ${result} users` });
  } catch (error) {
    console.error('Error during bulk delete:', error.message);
    res.status(500).json({ message: 'Error during bulk delete', error: error.message });
  }
});

// POST /admin/users/bulk-import - Import multiple users from CSV
router.post('/users/bulk-import', authenticateToken, checkAdmin, async (req, res) => {
  const users = req.body;

  try {
    console.log(`Received request to bulk import users by admin ${req.user.id}:`, users);

    // Validate request body
    if (!Array.isArray(users) || users.length === 0) {
      console.log('Validation failed: users must be a non-empty array');
      return res.status(400).json({ message: 'Users must be a non-empty array' });
    }

    // Validate each user and hash passwords
    for (const user of users) {
      if (!user.email || !user.password || !user.role || !user.subscription) {
        console.log('Validation failed: Missing required fields in user:', user);
        return res.status(400).json({
          message: 'Missing required fields in one or more users',
          missing: {
            email: !user.email,
            password: !user.password,
            role: !user.role,
            subscription: !user.subscription,
          },
        });
      }

      // Validate role value
      if (!['user', 'admin'].includes(user.role)) {
        console.log('Validation failed: Invalid role value:', user.role);
        return res.status(400).json({ message: 'Role must be "user" or "admin"' });
      }

      // Validate subscription value
      if (!['basic', 'pro'].includes(user.subscription)) {
        console.log('Validation failed: Invalid subscription value:', user.subscription);
        return res.status(400).json({ message: 'Subscription must be "basic" or "pro"' });
      }

      // Hash the password
      user.password = await bcrypt.hash(user.password, 10);
    }

    // Create users in the database
    const createdUsers = await User.bulkCreate(users, { returning: true });
    console.log(`Successfully imported ${createdUsers.length} users`);
    res.status(201).json(createdUsers);
  } catch (error) {
    console.error('Error during bulk import:', error.message);
    res.status(500).json({ message: 'Error during bulk import', error: error.message });
  }
});

// GET /admin/stats - Fetch admin statistics
router.get('/stats', authenticateToken, checkAdmin, async (req, res) => {
  try {
    // Total number of users
    const userCount = await User.count();

    // Total number of projects
    const projectCount = await Project.count();

    // Total number of default tiles
    const tileCount = await Tile.count();

    // Total number of custom tiles (user-specific tiles via userTile)
    const customTileCount = await UserTile.count();

    res.json({
      userCount,
      projectCount,
      tileCount,
      customTileCount,
    });
  } catch (error) {
    console.error('Error fetching admin statistics:', error.message);
    res.status(500).json({ message: 'Failed to fetch admin statistics', error: error.message });
  }
});

module.exports = router;