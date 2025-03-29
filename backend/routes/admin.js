const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { user, tile } = require('../db');

// Middleware to ensure only admins can access these routes
const checkAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// GET /stats - Fetch admin statistics (number of tiles and users)
router.get('/stats', authenticateToken, checkAdmin, async (req, res) => {
  try {
    console.log('Fetching admin statistics for user:', req.user.id);

    // Fetch number of tiles
    const tileCount = await tile.count();
    console.log('Total tiles in database:', tileCount);

    // Fetch number of users
    const userCount = await user.count();
    console.log('Total users in database:', userCount);

    res.json({
      tileCount,
      userCount,
    });
  } catch (error) {
    console.error('Error fetching admin statistics:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Error fetching admin statistics', error: error.message });
  }
});

module.exports = router;