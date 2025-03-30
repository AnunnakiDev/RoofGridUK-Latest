require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const { Client } = require('pg');

// Log environment variables to debug
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS);

// Function to create the database if it doesn't exist
const createDatabaseIfNotExists = async () => {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASS || 'password1234', // Use environment variable
    port: process.env.DB_PORT || 5432,
    database: 'postgres', // Connect to the default 'postgres' database
  });

  try {
    console.log('Connecting to PostgreSQL to check/create database...');
    await client.connect();
    console.log('Connected to PostgreSQL successfully.');

    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'roofgrid_uk'");
    if (res.rowCount === 0) {
      console.log('Database roofgrid_uk does not exist, creating it...');
      await client.query('CREATE DATABASE roofgrid_uk');
      console.log('Database roofgrid_uk created successfully.');
    } else {
      console.log('Database roofgrid_uk already exists.');
    }
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    await client.end();
  }
};

// Initialize Sequelize with PostgreSQL
const sequelize = new Sequelize(process.env.DATABASE_URL || {
  dialect: 'postgres',
  database: process.env.DB_NAME || 'roofgrid_uk',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'password1234',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
}, {
  dialect: 'postgres',
  define: {
    freezeTableName: true, // Use model name as table name
  },
});

// Import models
console.log('Importing models...');
const tile = require('./models/tiles')(sequelize, DataTypes);
console.log('Tile model imported successfully, table name:', tile.tableName);
const project = require('./models/project')(sequelize, DataTypes);
console.log('Project model imported successfully, table name:', project.tableName);
const user = require('./models/user')(sequelize, DataTypes);
console.log('User model imported successfully, table name:', user.tableName);
const userTile = require('./models/userTile')(sequelize, DataTypes);
console.log('UserTile model imported successfully, table name:', userTile.tableName);
const passwordResetToken = require('./models/passwordResetToken')(sequelize);
console.log('PasswordResetToken model imported successfully, table name:', passwordResetToken.tableName);

// Define associations
const models = { tile, project, user, userTile, passwordResetToken };
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    console.log(`Setting up associations for model: ${modelName}`);
    models[modelName].associate(models);
  }
});

// Sync database using migrations
const initDb = async () => {
  try {
    // Create the database if it doesn't exist
    await createDatabaseIfNotExists();

    // Test the database connection
    console.log('Testing database connection to roofgrid_uk...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Note: Migrations handle schema changes; sync with alter for minor adjustments
    console.log('Starting database sync...');
    await sequelize.sync({ alter: true }); // Alter tables if needed, no drop
    console.log('Database synced successfully.');

    // Verify tables (optional for debugging)
    console.log('Verifying user table...');
    const users = await user.findAll();
    console.log('Users in database:', users.map(u => u.toJSON()));

    console.log('Verifying tile table...');
    const tiles = await tile.findAll();
    console.log('Tiles in database:', tiles.map(t => t.toJSON()));

    console.log('Verifying project table...');
    const projects = await project.findAll();
    console.log('Projects in database:', projects.map(p => p.toJSON()));
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error; // Stop the server if initialization fails
  }
};

module.exports = { sequelize, initDb, tile, project, user, userTile, passwordResetToken };