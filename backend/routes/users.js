const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Get user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, role, subscription FROM users WHERE id = $1', [req.user.id]);
    res.json(result.rows[0]);
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
    if (password) updates.password = await require('bcrypt').hash(password, 10);
    const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(', ');
    const values = Object.values(updates);
    values.push(req.user.id);
    const result = await pool.query(`UPDATE users SET ${setClause} WHERE id = $${values.length} RETURNING *`, values);
    res.json(result.rows[0]);
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
    const result = await pool.query('SELECT * FROM user_tiles WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
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
    const result = await pool.query(
      'INSERT INTO user_tiles (user_id, name, type, length, width, eave_tile_length, headlap, crossBonded, minGauge, maxGauge, minSpacing, maxSpacing, datasheet_link) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
      [req.user.id, name, type, length, width, eave_tile_length, headlap, crossBonded, minGauge, maxGauge, minSpacing, maxSpacing, datasheet_link]
    );
    res.status(201).json(result.rows[0]);
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
    const result = await pool.query('DELETE FROM user_tiles WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Tile not found' });
    }
    res.json({ message: 'Personal tile deleted successfully' });
  } catch (err) {
    console.error('Error deleting personal tile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;