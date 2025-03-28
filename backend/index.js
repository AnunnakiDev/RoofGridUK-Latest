require('dotenv').config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const express = require('express');
const cors = require('cors');
const app = express();
const { initDb } = require('./db'); // Import initDb from db.js
const authRoutes = require('./routes/auth');
const tilesRoutes = require('./routes/tiles');
const projectsRoutes = require('./routes/projects');
const userTilesRoutes = require('./routes/userTiles');
const authenticateToken = require('./middleware/auth');

// Initialize the database before starting the server
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

    // Protected routes (require authentication)
    app.use('/api/tiles', authenticateToken, tilesRoutes);
    app.use('/api/projects', authenticateToken, projectsRoutes);
    app.use('/api/users', authenticateToken, userTilesRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1); // Exit the process if database initialization fails
  }
};

// Start the server
startServer();