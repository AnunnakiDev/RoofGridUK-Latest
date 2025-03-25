const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Get all projects for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  if (req.user.subscription === 'free') {
    return res.status(403).json({ message: 'Upgrade to Pro to save and view projects' });
  }
  try {
    const result = await pool.query(
      'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new project
router.post('/', authenticateToken, async (req, res) => {
  if (req.user.subscription === 'free') {
    return res.status(403).json({ message: 'Upgrade to Pro to save projects' });
  }
  const { title, input_data, results } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO projects (user_id, title, input_data, results) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, title, input_data, results]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error saving project:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a project
router.delete('/:id', authenticateToken, async (req, res) => {
  if (req.user.subscription === 'free') {
    return res.status(403).json({ message: 'Upgrade to Pro to delete projects' });
  }
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM projects WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Share a project
router.post('/share', authenticateToken, async (req, res) => {
  if (req.user.subscription === 'free') {
    return res.status(403).json({ message: 'Upgrade to Pro to share projects' });
  }
  const { projectId } = req.body;
  const shareToken = require('crypto').randomBytes(16).toString('hex');
  try {
    const result = await pool.query(
      'INSERT INTO shared_projects (project_id, share_token) VALUES ($1, $2) RETURNING *',
      [projectId, shareToken]
    );
    res.status(201).json({ shareToken: result.rows[0].share_token });
  } catch (err) {
    console.error('Error sharing project:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a shared project
router.get('/shared/:token', async (req, res) => {
  const { token } = req.params;
  try {
    const shareResult = await pool.query('SELECT project_id FROM shared_projects WHERE share_token = $1', [token]);
    if (shareResult.rows.length === 0) {
      return res.status(404).json({ message: 'Shared project not found' });
    }
    const projectResult = await pool.query('SELECT * FROM projects WHERE id = $1', [shareResult.rows[0].project_id]);
    res.json(projectResult.rows[0]);
  } catch (err) {
    console.error('Error fetching shared project:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;