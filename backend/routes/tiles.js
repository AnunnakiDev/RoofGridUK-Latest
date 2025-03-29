const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { tile, userTile } = require('../db');

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to check if user is Pro
const checkProUser = (req, res, next) => {
  if (req.user.subscription !== 'pro') {
    return res.status(403).json({ message: 'Pro subscription required' });
  }
  next();
};

// Get all default tiles
router.get('/', async (req, res) => {
  try {
    const tiles = await tile.findAll();
    res.json(tiles);
  } catch (error) {
    console.error('Error fetching tiles:', error);
    res.status(500).json({ message: 'Error fetching tiles', error: error.message });
  }
});

// Get all personal tiles for the authenticated user
router.get('/users/tiles', authenticateToken, checkProUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const tiles = await userTile.findAll({ where: { userId } });
    res.json(tiles);
  } catch (error) {
    console.error('Error fetching personal tiles:', error);
    res.status(500).json({ message: 'Error fetching personal tiles', error: error.message });
  }
});

// Create a new personal tile
router.post('/users/tiles', authenticateToken, checkProUser, async (req, res) => {
  const { name, type, length, width, mingauge, maxgauge, minspacing, maxspacing, lhTileWidth, crossbonded } = req.body;
  const userId = req.user.id;

  try {
    const newTile = await userTile.create({
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
    res.status(201).json(newTile);
  } catch (error) {
    console.error('Error creating personal tile:', error);
    res.status(500).json({ message: 'Error creating personal tile', error: error.message });
  }
});

// Update a personal tile
router.put('/users/tiles/:id', authenticateToken, checkProUser, async (req, res) => {
  const tileId = req.params.id;
  const userId = req.user.id;
  const { name, type, length, width, mingauge, maxgauge, minspacing, maxspacing, lhTileWidth, crossbonded } = req.body;

  try {
    const tileToUpdate = await userTile.findOne({ where: { id: tileId, userId } });
    if (!tileToUpdate) {
      return res.status(404).json({ message: 'Tile not found or you do not have permission to edit it' });
    }

    await tileToUpdate.update({
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

    res.json(tileToUpdate);
  } catch (error) {
    console.error('Error updating personal tile:', error);
    res.status(500).json({ message: 'Error updating personal tile', error: error.message });
  }
});

// Delete a personal tile
router.delete('/users/tiles/:id', authenticateToken, checkProUser, async (req, res) => {
  const tileId = req.params.id;
  const userId = req.user.id;

  try {
    const tileToDelete = await userTile.findOne({ where: { id: tileId, userId } });
    if (!tileToDelete) {
      return res.status(404).json({ message: 'Tile not found or you do not have permission to delete it' });
    }

    await tileToDelete.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting personal tile:', error);
    res.status(500).json({ message: 'Error deleting personal tile', error: error.message });
  }
});

module.exports = router;