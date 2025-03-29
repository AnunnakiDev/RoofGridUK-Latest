const express = require('express');
const router = express.Router();
const { authenticateToken, checkProUser } = require('../middleware/auth');
const { tile, userTile } = require('../db');

// GET / - Fetch default tiles (Pro users only)
router.get('/', authenticateToken, checkProUser, async (req, res) => {
  try {
    console.log('Fetching default tiles for Pro user:', req.user.id);
    const defaultTiles = await tile.findAll();
    const tilesList = defaultTiles.map(t => ({ ...t.toJSON(), isPersonal: false }));
    console.log('Returning default tiles:', tilesList.length);
    res.json(tilesList);
  } catch (error) {
    console.error('Error fetching default tiles:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Error fetching default tiles', error: error.message });
  }
});

// POST /users/tiles - Create a personal tile (Pro users only)
router.post('/users/tiles', authenticateToken, checkProUser, async (req, res) => {
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

    // Basic validation for required fields
    if (!name || !type || !length || !width || lhTileWidth === undefined || !crossbonded) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({ message: 'Missing required fields', missing: { name: !name, type: !type, length: !length, width: !width, lhTileWidth: lhTileWidth === undefined, crossbonded: !crossbonded } });
    }

    // Validate crossbonded value
    if (!['YES', 'NO'].includes(crossbonded)) {
      console.log('Validation failed: Invalid crossbonded value:', crossbonded);
      return res.status(400).json({ message: 'crossbonded must be "YES" or "NO"' });
    }

    // Validate numeric fields (basic checks from original code)
    if (mingauge !== null && (mingauge < 0 || !Number.isInteger(mingauge))) {
      console.log('Validation failed: Invalid mingauge:', mingauge);
      return res.status(400).json({ message: 'mingauge must be a non-negative integer or null' });
    }
    if (maxgauge !== null && (maxgauge < 0 || !Number.isInteger(maxgauge))) {
      console.log('Validation failed: Invalid maxgauge:', maxgauge);
      return res.status(400).json({ message: 'maxgauge must be a non-negative integer or null' });
    }
    if (minspacing !== null && (minspacing < 0 || !Number.isInteger(minspacing))) {
      console.log('Validation failed: Invalid minspacing:', minspacing);
      return res.status(400).json({ message: 'minspacing must be a non-negative integer or null' });
    }
    if (maxspacing !== null && (maxspacing < 0 || !Number.isInteger(maxspacing))) {
      console.log('Validation failed: Invalid maxspacing:', maxspacing);
      return res.status(400).json({ message: 'maxspacing must be a non-negative integer or null' });
    }

    // Create the new tile
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

    console.log('Created new tile successfully:', newTile.toJSON());
    res.status(201).json(newTile);
  } catch (error) {
    console.error('Error creating personal tile:', error.message);
    console.error('Stack trace:', error.stack);
    console.error('Request payload causing error:', req.body);
    res.status(500).json({ message: 'Error creating personal tile', error: error.message });
  }
});

module.exports = router;