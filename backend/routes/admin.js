const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { authenticateToken } = require('../middleware/auth');
const { user, tile, userTile, project } = require('../db');
const { Op } = require('sequelize');

// Middleware to ensure only admins can access these routes
const checkAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// GET /stats - Fetch admin statistics (number of tiles, users, custom tiles, and projects)
router.get('/stats', authenticateToken, checkAdmin, async (req, res) => {
  try {
    console.log('Fetching admin statistics for user:', req.user.id);

    // Fetch number of default tiles
    const tileCount = await tile.count();
    console.log('Total default tiles in database:', tileCount);

    // Fetch number of users
    const userCount = await user.count();
    console.log('Total users in database:', userCount);

    // Fetch number of custom tiles (userTile)
    const customTileCount = await userTile.count();
    console.log('Total custom tiles in database:', customTileCount);

    // Fetch number of saved projects
    const projectCount = await project.count();
    console.log('Total saved projects in database:', projectCount);

    res.json({
      tileCount,
      userCount,
      customTileCount,
      projectCount,
    });
  } catch (error) {
    console.error('Error fetching admin statistics:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Error fetching admin statistics', error: error.message });
  }
});

// GET /users - Fetch all users with pagination and search
router.get('/users', authenticateToken, checkAdmin, async (req, res) => {
  try {
    console.log('Fetching users for admin:', req.user.id);

    // Get pagination and search parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    // Build the where clause for search
    const where = search
      ? {
          email: {
            [Op.iLike]: `%${search}%`, // Case-insensitive search
          },
        }
      : {};

    // Fetch users with pagination and search
    const { count, rows } = await user.findAndCountAll({
      attributes: ['id', 'email', 'role', 'subscription'],
      where,
      limit,
      offset,
    });

    console.log(`Returning ${rows.length} users for page ${page}, limit ${limit}, search: ${search}`);
    res.json({
      users: rows,
      totalUsers: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// POST /users - Create a new user
router.post('/users', authenticateToken, checkAdmin, async (req, res) => {
  const { email, password, role, subscription } = req.body;

  try {
    console.log(`Received request to create user by admin ${req.user.id}:`, req.body);

    // Validate required fields
    if (!email || !password || !role || !subscription) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({
        message: 'Missing required fields',
        missing: { email: !email, password: !password, role: !role, subscription: !subscription },
      });
    }

    // Validate role and subscription values
    if (!['admin', 'user'].includes(role)) {
      console.log('Validation failed: Invalid role:', role);
      return res.status(400).json({ message: 'Role must be "admin" or "user"' });
    }
    if (!['basic', 'pro'].includes(subscription)) {
      console.log('Validation failed: Invalid subscription:', subscription);
      return res.status(400).json({ message: 'Subscription must be "basic" or "pro"' });
    }

    // Check if email already exists
    const existingUser = await user.findOne({ where: { email } });
    if (existingUser) {
      console.log('Validation failed: Email already exists:', email);
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the new user
    const newUser = await user.create({
      email,
      password: hashedPassword,
      role,
      subscription,
    });

    console.log('Created new user successfully:', newUser.id);
    // Return the new user without the password
    const { password: _, ...userWithoutPassword } = newUser.toJSON();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Error creating user:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// PUT /users/:id - Update a user's role and subscription
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
        missing: { role: !role, subscription: !subscription },
      });
    }

    // Validate role and subscription values
    if (!['admin', 'user'].includes(role)) {
      console.log('Validation failed: Invalid role:', role);
      return res.status(400).json({ message: 'Role must be "admin" or "user"' });
    }
    if (!['basic', 'pro'].includes(subscription)) {
      console.log('Validation failed: Invalid subscription:', subscription);
      return res.status(400).json({ message: 'Subscription must be "basic" or "pro"' });
    }

    // Check if user exists
    const existingUser = await user.findOne({ where: { id } });
    if (!existingUser) {
      console.log('User not found:', id);
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent an admin from modifying their own role or subscription
    if (existingUser.id === req.user.id) {
      console.log('Admin attempted to modify their own account:', req.user.id);
      return res.status(403).json({ message: 'Cannot modify your own account' });
    }

    // Update the user
    const updatedUser = await user.update(
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
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// DELETE /users/:id - Delete a user
router.delete('/users/:id', authenticateToken, checkAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`Received request to delete user ${id} by admin ${req.user.id}`);

    // Check if user exists
    const existingUser = await user.findOne({ where: { id } });
    if (!existingUser) {
      console.log('User not found:', id);
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent an admin from deleting their own account
    if (existingUser.id === req.user.id) {
      console.log('Admin attempted to delete their own account:', req.user.id);
      return res.status(403).json({ message: 'Cannot delete your own account' });
    }

    // Delete the user
    const result = await user.destroy({ where: { id } });

    if (result === 0) {
      console.log('User deletion failed, no rows affected:', id);
      return res.status(500).json({ message: 'Failed to delete user' });
    }

    console.log('Deleted user successfully:', id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// POST /users/bulk-delete - Delete multiple users
router.post('/users/bulk-delete', authenticateToken, checkAdmin, async (req, res) => {
  const { userIds } = req.body;

  try {
    console.log(`Received request to bulk delete users by admin ${req.user.id}:`, userIds);

    // Validate request body
    if (!Array.isArray(userIds) || userIds.length === 0) {
      console.log('Validation failed: userIds must be a non-empty array');
      return res.status(400).json({ message: 'userIds must be a non-empty array' });
    }

    // Check if any of the users to delete is the admin themselves
    if (userIds.includes(req.user.id)) {
      console.log('Admin attempted to delete their own account:', req.user.id);
      return res.status(403).json({ message: 'Cannot delete your own account' });
    }

    // Check if all users exist
    const existingUsers = await user.findAll({
      where: { id: userIds },
    });

    if (existingUsers.length !== userIds.length) {
      console.log('Some users not found:', userIds);
      return res.status(404).json({ message: 'One or more users not found' });
    }

    // Delete the users
    const result = await user.destroy({
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
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Error during bulk delete', error: error.message });
  }
});

module.exports = router;