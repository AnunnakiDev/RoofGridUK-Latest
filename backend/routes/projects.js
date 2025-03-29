const express = require('express');
const router = express.Router();
const { project } = require('../db');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, async (req, res) => {
  if (req.user.subscription === 'free') {
    return res.status(403).json({ message: 'Upgrade to Pro to save and view projects' });
  }
  try {
    const projects = await project.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  if (req.user.subscription === 'free') {
    return res.status(403).json({ message: 'Upgrade to Pro to save projects' });
  }
  const {
    projectName,
    rafterHeights,
    widths,
    settings,
    verticalResults,
    horizontalResults,
    totalResults,
    materialType,
    slateTileHeight,
    tileCoverWidth,
    minGauge,
    maxGauge,
    minSpacing,
    maxSpacing,
    crossBonded,
  } = req.body;
  try {
    const newProject = await project.create({
      userId: req.user.id,
      projectName,
      rafterHeights,
      widths,
      settings: {
        ...settings,
        materialType,
        slateTileHeight,
        tileCoverWidth,
        minGauge,
        maxGauge,
        minSpacing,
        maxSpacing,
        crossBonded,
      },
      verticalResults,
      horizontalResults,
      totalResults,
    });
    res.status(201).json(newProject);
  } catch (err) {
    console.error('Error saving project:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  if (req.user.subscription === 'free') {
    return res.status(403).json({ message: 'Upgrade to Pro to delete projects' });
  }
  const { id } = req.params;
  try {
    const result = await project.destroy({
      where: { id, userId: req.user.id },
    });
    if (result === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/share', authenticateToken, async (req, res) => {
  if (req.user.subscription === 'free') {
    return res.status(403).json({ message: 'Upgrade to Pro to share projects' });
  }
  const { projectId } = req.body;
  const shareToken = require('crypto').randomBytes(16).toString('hex');
  try {
    res.status(501).json({ message: 'Sharing functionality not implemented yet' });
  } catch (err) {
    console.error('Error sharing project:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/shared/:token', async (req, res) => {
  const { token } = req.params;
  try {
    res.status(501).json({ message: 'Shared project functionality not implemented yet' });
  } catch (err) {
    console.error('Error fetching shared project:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;