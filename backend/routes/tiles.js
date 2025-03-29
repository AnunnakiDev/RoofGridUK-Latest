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

// POST / - Create a default tile (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
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

  try {
    console.log('Received request to create default tile:', req.body);

    // Validate required fields
    if (!name || !type || !length || !width || lhTileWidth === undefined || !crossbonded) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({
        message: 'Missing required fields',
        missing: { name: !name, type: !type, length: !length, width: !width, lhTileWidth: lhTileWidth === undefined, crossbonded: !crossbonded }
      });
    }

    // Validate type against predefined categories
    const validTypes = ['Slate', 'Tile', 'Fibre Cement Slate', 'Plain Tile', 'Interlocking Tile'];
    if (!validTypes.includes(type)) {
      console.log('Validation failed: Invalid type:', type);
      return res.status(400).json({ message: `Type must be one of: ${validTypes.join(', ')}` });
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

    const newTile = await tile.create({
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

    console.log('Created new default tile:', newTile.toJSON());
    res.status(201).json(newTile);
  } catch (error) {
    console.error('Error creating default tile:', error.message);
    console.error('Stack trace:', error.stack);
    console.error('Request payload causing error:', req.body);
    res.status(500).json({ message: 'Error creating default tile', error: error.message });
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
    console.log('Received request to create personal tile:', req.body);

    if (!name || !type || !length || !width || lhTileWidth === undefined || !crossbonded) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({ message: 'Missing required fields', missing: { name: !name, type: !type, length: !length, width: !width, lhTileWidth: lhTileWidth === undefined, crossbonded: !crossbonded } });
    }
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

    console.log('Created new tile:', newTile.toJSON());
    res.status(201).json(newTile);
  } catch (error) {
    console.error('Error creating personal tile:', error.message);
    console.error('Stack trace:', error.stack);
    console.error('Request payload causing error:', req.body);
    res.status(500).json({ message: 'Error creating personal tile', error: error.message });
  }
});

// PUT /:id - Update a default tile (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  const { id } = req.params;
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

  try {
    console.log('Received request to update default tile:', id);
    console.log('Request payload:', req.body);

    // Validate required fields
    if (!name || !type || !length || !width || lhTileWidth === undefined || !crossbonded) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({
        message: 'Missing required fields',
        missing: { name: !name, type: !type, length: !length, width: !width, lhTileWidth: lhTileWidth === undefined, crossbonded: !crossbonded }
      });
    }

    // Validate type against predefined categories
    const validTypes = ['Slate', 'Tile', 'Fibre Cement Slate', 'Plain Tile', 'Interlocking Tile'];
    if (!validTypes.includes(type)) {
      console.log('Validation failed: Invalid type:', type);
      return res.status(400).json({ message: `Type must be one of: ${validTypes.join(', ')}` });
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

    // Check if tile exists
    const existingTile = await tile.findOne({
      where: { id },
    });

    if (!existingTile) {
      console.log('Tile not found:', id);
      return res.status(404).json({ message: 'Tile not found' });
    }

    // Update the tile
    const updatedTile = await tile.update(
      {
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
      },
      {
        where: { id },
        returning: true,
      }
    );

    if (updatedTile[0] === 0) {
      console.log('Tile update failed, no rows affected:', id);
      return res.status(500).json({ message: 'Failed to update tile' });
    }

    console.log('Updated tile successfully:', updatedTile[1][0].toJSON());
    res.json(updatedTile[1][0]);
  } catch (err) {
    console.error('Error updating default tile:', err.message);
    console.error('Stack trace:', err.stack);
    console.error('Request payload causing error:', req.body);
    res.status(500).json({ message: 'Error updating default tile', error: err.message });
  }
});

// DELETE /:id - Delete a default tile (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  const { id } = req.params;

  try {
    console.log('Received request to delete default tile:', id);

    // Check if tile exists
    const existingTile = await tile.findOne({
      where: { id },
    });

    if (!existingTile) {
      console.log('Tile not found:', id);
      return res.status(404).json({ message: 'Tile not found' });
    }

    // Delete the tile
    const result = await tile.destroy({
      where: { id },
    });

    if (result === 0) {
      console.log('Tile deletion failed, no rows affected:', id);
      return res.status(500).json({ message: 'Failed to delete tile' });
    }

    console.log('Deleted default tile successfully:', id);
    res.json({ message: 'Default tile deleted successfully' });
  } catch (err) {
    console.error('Error deleting default tile:', err.message);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ message: 'Error deleting default tile', error: err.message });
  }
});

module.exports = router;