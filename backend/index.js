require('dotenv').config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const express = require('express');
const cors = require('cors');
const app = express();
const { initDb } = require('./db');
const authRoutes = require('./routes/auth');
const tilesRoutes = require('./routes/tiles');
const projectsRoutes = require('./routes/projects');
const userTilesRoutes = require('./routes/userTiles');
// Removed authenticateToken import since it's used within routes

const startServer = async () => {
  try {
    console.log('Initializing database...');
    await initDb();
    console.log('Database initialized successfully.');

    // Configure CORS to allow requests from the frontend
    app.use(cors({
      origin: ['http://localhost:3000', 'http://localhost:3002'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    app.use(express.json());

    // Public routes (no authentication required)
    app.use('/api/auth', authRoutes);

    // Protected routes (authentication handled within each route file)
    app.use('/api/tiles', tilesRoutes);       // authenticateToken and checkProUser in tiles.js
    app.use('/api/projects', projectsRoutes); // authenticateToken in projects.js
    app.use('/api/users', userTilesRoutes);   // authenticateToken in userTiles.js

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1); // Exit the process if database initialization fails
  }
};

// Start the server
startServer();