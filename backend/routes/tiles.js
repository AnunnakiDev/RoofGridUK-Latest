const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get all tiles (accessible to pro users)
router.get('/', authenticateToken, async (req, res) => {
  if (req.user.subscription === 'free') {
    return res.status(403).json({ message: 'Upgrade to Pro to access tile library' });
  }
  try {
    const result = await pool.query('SELECT * FROM tiles');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tiles:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new tile (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const {
    name, type, length, width, eave_tile_length, headlap, crossBonded,
    minGauge, maxGauge, minSpacing, maxSpacing, datasheet_link
  } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tiles (name, type, length, width, eave_tile_length, headlap, crossBonded, minGauge, maxGauge, minSpacing, maxSpacing, datasheet_link) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
      [name, type, length, width, eave_tile_length, headlap, crossBonded, minGauge, maxGauge, minSpacing, maxSpacing, datasheet_link]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding tile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a tile (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const {
    name, type, length, width, eave_tile_length, headlap, crossBonded,
    minGauge, maxGauge, minSpacing, maxSpacing, datasheet_link
  } = req.body;
  try {
    const result = await pool.query(
      'UPDATE tiles SET name = $1, type = $2, length = $3, width = $4, eave_tile_length = $5, headlap = $6, crossBonded = $7, minGauge = $8, maxGauge = $9, minSpacing = $10, maxSpacing = $11, datasheet_link = $12 WHERE id = $13 RETURNING *',
      [name, type, length, width, eave_tile_length, headlap, crossBonded, minGauge, maxGauge, minSpacing, maxSpacing, datasheet_link, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Tile not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating tile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a tile (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM tiles WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Tile not found' });
    }
    res.json({ message: 'Tile deleted successfully' });
  } catch (err) {
    console.error('Error deleting tile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Import tiles from CSV (admin only, placeholder)
router.post('/import', authenticateToken, requireAdmin, async (req, res) => {
  res.status(501).json({ message: 'CSV import not implemented yet' });
});

// Submit a tile for admin review (pro users)
router.post('/submit', authenticateToken, async (req, res) => {
  if (req.user.subscription === 'free') {
    return res.status(403).json({ message: 'Upgrade to Pro to submit tiles' });
  }
  const { tileId } = req.body;
  try {
    const tileResult = await pool.query('SELECT * FROM user_tiles WHERE id = $1 AND user_id = $2', [tileId, req.user.id]);
    if (tileResult.rows.length === 0) {
      return res.status(404).json({ message: 'Tile not found' });
    }
    const tile = tileResult.rows[0];
    const result = await pool.query(
      'INSERT INTO tile_submissions (user_id, tile_data, status) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, tile, 'pending']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error submitting tile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all tile submissions (admin only)
router.get('/submissions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tile_submissions ORDER BY submitted_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tile submissions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve or reject a tile submission (admin only)
router.post('/submissions/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'
  try {
    const submissionResult = await pool.query('SELECT * FROM tile_submissions WHERE id = $1', [id]);
    if (submissionResult.rows.length === 0) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    const submission = submissionResult.rows[0];
    if (status === 'approved') {
      const tileData = submission.tile_data;
      await pool.query(
        'INSERT INTO tiles (name, type, length, width, eave_tile_length, headlap, crossBonded, minGauge, maxGauge, minSpacing, maxSpacing, datasheet_link) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
        [tileData.name, tileData.type, tileData.length, tileData.width, tileData.eave_tile_length, tileData.headlap, tileData.crossBonded, tileData.minGauge, tileData.maxGauge, tileData.minSpacing, tileData.maxSpacing, tileData.datasheet_link]
      );
    }
    const result = await pool.query(
      'UPDATE tile_submissions SET status = $1, reviewed_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating tile submission:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;