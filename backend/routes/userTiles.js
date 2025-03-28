const express = require('express');
const router = express.Router();
const { user, userTile } = require('../db');

// Load bcryptjs and log any issues
let bcrypt;
try {
  bcrypt = require('bcryptjs');
  console.log('bcryptjs loaded successfully in userTiles.js');
} catch (error) {
  console.error('Error loading bcryptjs in userTiles.js:', error);
  throw error;
}

const authenticateToken = require('../middleware/auth');

// Get user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const foundUser = await user.findByPk(req.user.id, {
      attributes: ['id', 'username', 'role', 'subscription'],
    });
    res.json(foundUser);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
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
    console.error('Error updating user profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's personal tiles (pro users)
router.get('/tiles', authenticateToken, async (req, res) => {
  if (req.user.subscription === 'free') {
    return res.status(403).json({ message: 'Upgrade to Pro to manage personal tiles' });
  }
  try {
    const tiles = await userTile.findAll({
      where: { userId: req.user.id },
    });
    res.json(tiles);
  } catch (err) {
    console.error('Error fetching personal tiles:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a personal tile (pro users)
router.post('/tiles', authenticateToken, async (req, res) => {
  if (req.user.subscription === 'free') {
    return res.status(403).json({ message: 'Upgrade to Pro to manage personal tiles' });
  }
  const {
    name, type, length, width, eave_tile_length, headlap, crossBonded,
    minGauge, maxGauge, minSpacing, maxSpacing, datasheet_link
  } = req.body;
  try {
    const tile = await userTile.create({
      userId: req.user.id,
      name,
      type,
      length,
      width,
      eave_tile_length,
      headlap,
      crossBonded,
      minGauge,
      maxGauge,
      minSpacing,
      maxSpacing,
      datasheet_link,
    });
    res.status(201).json(tile);
  } catch (err) {
    console.error('Error adding personal tile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a personal tile (pro users)
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
      return res.status(404).json({ message: 'Tile not found' });
    }
    res.json({ message: 'Personal tile deleted successfully' });
  } catch (err) {
    console.error('Error deleting personal tile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;