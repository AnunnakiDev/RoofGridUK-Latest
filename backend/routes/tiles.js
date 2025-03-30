const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { tile } = require('../db');

// Middleware to ensure only admins can access these routes
const checkAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// GET /tiles - Fetch all tiles
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tiles = await tile.findAll();
    res.json(tiles);
  } catch (error) {
    console.error('Error fetching tiles:', error.message);
    res.status(500).json({ message: 'Error fetching tiles', error: error.message });
  }
});

// POST /tiles - Create a new tile
router.post('/', authenticateToken, checkAdmin, async (req, res) => {
  const { name, type, length, width, crossbonded, mingauge, maxgauge, minspacing, maxspacing, lhTileWidth } = req.body;

  try {
    console.log(`Received request to create tile by admin ${req.user.id}:`, req.body);

    // Validate required fields
    if (!name || !type || !length || !width || !crossbonded || !lhTileWidth) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({
        message: 'Missing required fields',
        missing: {
          name: !name,
          type: !type,
          length: !length,
          width: !width,
          crossbonded: !crossbonded,
          lhTileWidth: !lhTileWidth,
        },
      });
    }

    // Validate crossbonded value
    if (!['YES', 'NO'].includes(crossbonded)) {
      console.log('Validation failed: Invalid crossbonded value:', crossbonded);
      return res.status(400).json({ message: 'Crossbonded must be "YES" or "NO"' });
    }

    const newTile = await tile.create({
      name,
      type,
      length,
      width,
      crossbonded,
      mingauge: mingauge || 75,
      maxgauge: maxgauge || 325,
      minspacing: minspacing || 3,
      maxspacing: maxspacing || 7,
      lhTileWidth,
    });

    console.log('Created new tile successfully:', newTile.id);
    res.status(201).json(newTile);
  } catch (error) {
    console.error('Error creating tile:', error.message);
    res.status(500).json({ message: 'Error creating tile', error: error.message });
  }
});

// PUT /tiles/:id - Update a tile
router.put('/:id', authenticateToken, checkAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, type, length, width, crossbonded, mingauge, maxgauge, minspacing, maxspacing, lhTileWidth } = req.body;

  try {
    console.log(`Received request to update tile ${id} by admin ${req.user.id}:`, req.body);

    // Validate required fields
    if (!name || !type || !length || !width || !crossbonded || !lhTileWidth) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({
        message: 'Missing required fields',
        missing: {
          name: !name,
          type: !type,
          length: !length,
          width: !width,
          crossbonded: !crossbonded,
          lhTileWidth: !lhTileWidth,
        },
      });
    }

    // Validate crossbonded value
    if (!['YES', 'NO'].includes(crossbonded)) {
      console.log('Validation failed: Invalid crossbonded value:', crossbonded);
      return res.status(400).json({ message: 'Crossbonded must be "YES" or "NO"' });
    }

    const existingTile = await tile.findOne({ where: { id } });
    if (!existingTile) {
      console.log('Tile not found:', id);
      return res.status(404).json({ message: 'Tile not found' });
    }

    const updatedTile = await tile.update(
      { name, type, length, width, crossbonded, mingauge, maxgauge, minspacing, maxspacing, lhTileWidth },
      { where: { id }, returning: true }
    );

    if (updatedTile[0] === 0) {
      console.log('Tile update failed, no rows affected:', id);
      return res.status(500).json({ message: 'Failed to update tile' });
    }

    console.log('Updated tile successfully:', updatedTile[1][0].toJSON());
    res.json(updatedTile[1][0]);
  } catch (error) {
    console.error('Error updating tile:', error.message);
    res.status(500).json({ message: 'Error updating tile', error: error.message });
  }
});

// DELETE /tiles/:id - Delete a tile
router.delete('/:id', authenticateToken, checkAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`Received request to delete tile ${id} by admin ${req.user.id}`);

    const existingTile = await tile.findOne({ where: { id } });
    if (!existingTile) {
      console.log('Tile not found:', id);
      return res.status(404).json({ message: 'Tile not found' });
    }

    const result = await tile.destroy({ where: { id } });

    if (result === 0) {
      console.log('Tile deletion failed, no rows affected:', id);
      return res.status(500).json({ message: 'Failed to delete tile' });
    }

    console.log('Deleted tile successfully:', id);
    res.json({ message: 'Tile deleted successfully' });
  } catch (error) {
    console.error('Error deleting tile:', error.message);
    res.status(500).json({ message: 'Error deleting tile', error: error.message });
  }
});

// POST /tiles/bulk-delete - Delete multiple tiles
router.post('/bulk-delete', authenticateToken, checkAdmin, async (req, res) => {
  const { tileIds } = req.body;

  try {
    console.log(`Received request to bulk delete tiles by admin ${req.user.id}:`, tileIds);

    // Validate request body
    if (!Array.isArray(tileIds) || tileIds.length === 0) {
      console.log('Validation failed: tileIds must be a non-empty array');
      return res.status(400).json({ message: 'tileIds must be a non-empty array' });
    }

    // Check if all tiles exist
    const existingTiles = await tile.findAll({
      where: { id: tileIds },
    });

    if (existingTiles.length !== tileIds.length) {
      console.log('Some tiles not found:', tileIds);
      return res.status(404).json({ message: 'One or more tiles not found' });
    }

    // Delete the tiles
    const result = await tile.destroy({
      where: { id: tileIds },
    });

    if (result === 0) {
      console.log('Bulk deletion failed, no rows affected');
      return res.status(500).json({ message: 'Failed to delete tiles' });
    }

    console.log(`Successfully deleted ${result} tiles`);
    res.json({ message: `Successfully deleted ${result} tiles` });
  } catch (error) {
    console.error('Error during bulk delete:', error.message);
    res.status(500).json({ message: 'Error during bulk delete', error: error.message });
  }
});

module.exports = router;