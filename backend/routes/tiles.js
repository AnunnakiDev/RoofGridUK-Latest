const express = require('express');
const router = express.Router();
const { tile } = require('../db'); // Already lowercase 'tile'

// Get all tiles
router.get('/', async (req, res) => {
  try {
    const tiles = await tile.findAll();
    res.json(tiles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tiles', error });
  }
});

module.exports = router;