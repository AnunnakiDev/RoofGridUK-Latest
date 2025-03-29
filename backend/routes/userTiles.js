const express = require('express');
const router = express.Router();
const { user, userTile } = require('../db');

let bcrypt;
try {
  bcrypt = require('bcryptjs');
  console.log('bcryptjs loaded successfully in userTiles.js');
} catch (error) {
  console.error('Error loading bcryptjs in userTiles.js:', error);
  throw error;
}

const { authenticateToken } = require('../middleware/auth');

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const foundUser = await user.findByPk(req.user.id, {
      attributes: ['id', 'username', 'role', 'subscription'],
    });
    res.json(foundUser);
  } catch (err) {
    console.error('Error fetching user profile:', err.message);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ message: 'Error fetching user profile', error: err.message });
  }
});

router.put('/me', authenticateToken, async (req, res) => {
  const { username, password } = req.body;
  try {
    const updates = {};
    if (username) updates.username = username;
    if (password) {
      console.log('Hashing password for user update:', username);
      updates.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await user.update(updates, {
      where: { id: req.user.id },
      returning: true,
    });
    res.json(updatedUser[1][0]);
  } catch (err) {
    console.error('Error updating user profile:', err.message);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ message: 'Error updating user profile', error: err.message });
  }
});

router.get('/tiles', authenticateToken, async (req, res) => {
  if (req.user.subscription === 'free') {
    return res.status(403).json({ message: 'Upgrade to Pro to manage personal tiles' });
  }
  try {
    const tiles = await userTile.findAll({
      where: { userId: req.user.id },
    });
    console.log('Fetched personal tiles for user:', req.user.id, 'Count:', tiles.length);
    res.json(tiles);
  } catch (err) {
    console.error('Error fetching personal tiles:', err.message);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ message: 'Error fetching personal tiles', error: err.message });
  }
});

router.post('/tiles', authenticateToken, async (req, res) => {
  if (req.user.subscription === 'free') {
    return res.status(403).json({ message: 'Upgrade to Pro to manage personal tiles' });
  }
  const {
    name,
    type,
    length,
    width,
    mingauge,
    maxgauge,
    minspacing,
    maxspacing,
    lhTileWidth,
    crossbonded,
  } = req.body;
  const userId = req.user.id;

  try {
    console.log('Received request to create personal tile for user:', userId);
    console.log('Request payload:', req.body);

    // Validate required fields
    if (!name || !type || !length || !width || lhTileWidth === undefined || !crossbonded) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({
        message: 'Missing required fields',
        missing: { name: !name, type: !type, length: !length, width: !width, lhTileWidth: lhTileWidth === undefined, crossbonded: !crossbonded }
      });
    }

    // Validate data types and constraints
    if (!['YES', 'NO'].includes(crossbonded)) {
      console.log('Validation failed: Invalid crossbonded value:', crossbonded);
      return res.status(400).json({ message: 'crossbonded must be "YES" or "NO"' });
    }
    if (isNaN(length) || !Number.isInteger(length) || length <= 0) {
      console.log('Validation failed: Invalid length:', length);
      return res.status(400).json({ message: 'length must be a positive integer' });
    }
    if (isNaN(width) || !Number.isInteger(width) || width <= 0) {
      console.log('Validation failed: Invalid width:', width);
      return res.status(400).json({ message: 'width must be a positive integer' });
    }
    if (isNaN(lhTileWidth) || !Number.isInteger(lhTileWidth) || lhTileWidth < 0) {
      console.log('Validation failed: Invalid lhTileWidth:', lhTileWidth);
      return res.status(400).json({ message: 'lhTileWidth must be a non-negative integer' });
    }
    if (mingauge !== null && (isNaN(mingauge) || !Number.isInteger(mingauge) || mingauge < 0)) {
      console.log('Validation failed: Invalid mingauge:', mingauge);
      return res.status(400).json({ message: 'mingauge must be a non-negative integer or null' });
    }
    if (maxgauge !== null && (isNaN(maxgauge) || !Number.isInteger(maxgauge) || maxgauge < 0)) {
      console.log('Validation failed: Invalid maxgauge:', maxgauge);
      return res.status(400).json({ message: 'maxgauge must be a non-negative integer or null' });
    }
    if (minspacing !== null && (isNaN(minspacing) || !Number.isInteger(minspacing) || minspacing < 0)) {
      console.log('Validation failed: Invalid minspacing:', minspacing);
      return res.status(400).json({ message: 'minspacing must be a non-negative integer or null' });
    }
    if (maxspacing !== null && (isNaN(maxspacing) || !Number.isInteger(maxspacing) || maxspacing < 0)) {
      console.log('Validation failed: Invalid maxspacing:', maxspacing);
      return res.status(400).json({ message: 'maxspacing must be a non-negative integer or null' });
    }

    const tile = await userTile.create({
      userId,
      name,
      type,
      length,
      width,
      mingauge,
      maxgauge,
      minspacing,
      maxspacing,
      lhTileWidth,
      crossbonded,
    });

    console.log('Created new tile successfully:', tile.toJSON());
    res.status(201).json(tile);
  } catch (err) {
    console.error('Error adding personal tile:', err.message);
    console.error('Stack trace:', err.stack);
    console.error('Request payload causing error:', req.body);
    res.status(500).json({ message: 'Error adding personal tile', error: err.message });
  }
});

router.delete('/tiles/:id', authenticateToken, async (req, res) => {
  if (req.user.subscription === 'free') {
    return res.status(403).json({ message: 'Upgrade to Pro to manage personal tiles' });
  }
  const { id } = req.params;
  try {
    const result = await userTile.destroy({
      where: { id, userId: req.user.id },
    });
    if (result === 0) {
      console.log('Tile not found for deletion:', id);
      return res.status(404).json({ message: 'Tile not found' });
    }
    console.log('Personal tile deleted successfully:', id);
    res.json({ message: 'Personal tile deleted successfully' });
  } catch (err) {
    console.error('Error deleting personal tile:', err.message);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ message: 'Error deleting personal tile', error: err.message });
  }
});

module.exports = router;