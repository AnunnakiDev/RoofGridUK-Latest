require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const tilesRoutes = require('./routes/tiles');
const projectsRoutes = require('./routes/projects');
const userTilesRoutes = require('./routes/userTiles');
const authenticateToken = require('./middleware/auth'); // Revert to direct import

app.use(express.json());

// Public routes (no authentication required)
app.use('/api/auth', authRoutes);

// Protected routes (require authentication)
app.use('/api/tiles', authenticateToken, tilesRoutes);
app.use('/api/projects', authenticateToken, projectsRoutes);
app.use('/api/users', authenticateToken, userTilesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));