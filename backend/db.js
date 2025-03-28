const { Sequelize, DataTypes } = require('sequelize');
const { Client } = require('pg');

// Function to create the database if it doesn't exist
const createDatabaseIfNotExists = async () => {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: 'password1234',
    port: 5432,
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
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  define: {
    // Ensure table names are lowercase to match the original schema
    freezeTableName: true,
    tableName: (modelName) => modelName.toLowerCase(),
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

// Define associations
const models = { tile, project, user, userTile };
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    console.log(`Setting up associations for model: ${modelName}`);
    models[modelName].associate(models);
  }
});

// Sync database
const initDb = async () => {
  try {
    // Create the database if it doesn't exist
    await createDatabaseIfNotExists();

    // Test the database connection
    console.log('Testing database connection to roofgrid_uk...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync the database (drop and recreate tables)
    console.log('Starting database sync...');
    await sequelize.sync({ force: true });
    console.log('Database synced successfully.');

    // Seed data
console.log('Seeding tiles...');
await tile.bulkCreate([
  {
    name: '500x250 Slate 75mm',
    type: 'slate',
    length: 500,
    width: 250,
    eave_tile_length: 0,
    headlap: 90,
    crossbonded: 'YES',
    mingauge: 195,
    maxgauge: 210,
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 367,
  },
  {
    name: 'CUPA 12 Spanish Slate 500x250',
    type: 'slate',
    length: 500,
    width: 250,
    eave_tile_length: 0,
    headlap: 90,
    crossbonded: 'YES',
    mingauge: 200,
    maxgauge: 225,
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 0,
  },
  {
    name: 'Welsh Slate 400x250',
    type: 'slate',
    length: 400,
    width: 250,
    eave_tile_length: 0,
    headlap: 90,
    crossbonded: 'YES',
    mingauge: 150,
    maxgauge: 175,
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 0,
  },
  {
    name: 'Welsh Slate 300x200',
    type: 'slate',
    length: 300,
    width: 200,
    eave_tile_length: 0,
    headlap: 90,
    crossbonded: 'YES',
    mingauge: 100,
    maxgauge: 125,
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 0,
  },
  {
    name: 'Welsh Penrhyn Capital Grade Slate 500x300',
    type: 'slate',
    length: 500,
    width: 300,
    eave_tile_length: 0,
    headlap: 90,
    crossbonded: 'YES',
    mingauge: 200,
    maxgauge: 225,
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 0,
  },
  {
    name: 'CUPA 5 Spanish Slate',
    type: 'slate',
    length: 500,
    width: 250,
    eave_tile_length: 0,
    headlap: 90,
    crossbonded: 'YES',
    mingauge: 200,
    maxgauge: 225,
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 0,
  },
  {
    name: 'Delabole Slate',
    type: 'slate',
    length: 500,
    width: 250,
    eave_tile_length: 0,
    headlap: 90,
    crossbonded: 'YES',
    mingauge: 200,
    maxgauge: 225,
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 0,
  },
  {
    name: 'Ffestiniog Blue Grey Slate',
    type: 'slate',
    length: 500,
    width: 300,
    eave_tile_length: 0,
    headlap: 90,
    crossbonded: 'YES',
    mingauge: 200,
    maxgauge: 225,
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 0,
  },
  {
    name: 'Westmorland Green Slate',
    type: 'slate',
    length: 500,
    width: 300,
    eave_tile_length: 0,
    headlap: 90,
    crossbonded: 'YES',
    mingauge: 200,
    maxgauge: 225,
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 0,
  },
  {
    name: 'Marley Birkdale 600x300',
    type: 'fibre-cement-slate',
    length: 600,
    width: 300,
    eave_tile_length: 0,
    headlap: 90,
    crossbonded: 'YES',
    mingauge: 255,
    maxgauge: 275,
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 0,
  },
  {
    name: 'Cembrit Jutland 600x300',
    type: 'fibre-cement-slate',
    length: 600,
    width: 300,
    eave_tile_length: 0,
    headlap: 90,
    crossbonded: 'YES',
    mingauge: 255,
    maxgauge: 275,
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 0,
  },
  {
    name: 'SVK Ardonit 600x300',
    type: 'fibre-cement-slate',
    length: 600,
    width: 300,
    eave_tile_length: 0,
    headlap: 90,
    crossbonded: 'YES',
    mingauge: 255,
    maxgauge: 275,
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 0,
  },
  {
    name: 'Redland 49',
    type: 'interlocking-tile',
    length: 382,
    width: 200,
    eave_tile_length: 0,
    headlap: 100,
    crossbonded: 'NO',
    mingauge: 75, // Default value (CSV: 0)
    maxgauge: 343,
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 0,
  },
  {
    name: 'Marley Modern',
    type: 'interlocking-tile',
    length: 420,
    width: 292,
    eave_tile_length: 0,
    headlap: 100,
    crossbonded: 'YES',
    mingauge: 293,
    maxgauge: 343,
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 0,
  },
  {
    name: 'Redland Regent',
    type: 'interlocking-tile',
    length: 418,
    width: 300,
    eave_tile_length: 0,
    headlap: 100,
    crossbonded: 'NO',
    mingauge: 75, // Default value (CSV: 0)
    maxgauge: 343,
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 0,
  },
  {
    name: 'Redland Mini Stonewold',
    type: 'interlocking-tile',
    length: 418,
    width: 294,
    eave_tile_length: 0,
    headlap: 100,
    crossbonded: 'NO',
    mingauge: 293,
    maxgauge: 343,
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 334,
  },
  {
    name: 'Marley Mendip',
    type: 'interlocking-tile',
    length: 420,
    width: 298,
    eave_tile_length: 0,
    headlap: 100,
    crossbonded: 'NO',
    mingauge: 75, // Default value (CSV: 0)
    maxgauge: 343,
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 333,
  },
  {
    name: 'Marley Mendip 12.5 Low Pitch',
    type: 'interlocking-tile',
    length: 420,
    width: 298,
    eave_tile_length: 0,
    headlap: 100,
    crossbonded: 'NO',
    mingauge: 75, // Default value (CSV: 0)
    maxgauge: 320,
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 0,
  },
  {
    name: 'Sandtoft Double Pantile',
    type: 'interlocking-tile',
    length: 420,
    width: 300,
    eave_tile_length: 0,
    headlap: 100,
    crossbonded: 'NO',
    mingauge: 75, // Default value (CSV: 0)
    maxgauge: 100, // Default value (CSV: 0)
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 0,
  },
  {
    name: 'Marley Anglia',
    type: 'interlocking-tile',
    length: 387,
    width: 204,
    eave_tile_length: 0,
    headlap: 100,
    crossbonded: 'NO',
    mingauge: 75, // Default value (CSV: 0)
    maxgauge: 100, // Default value (CSV: 0)
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 0,
  },
  {
    name: 'Marley Ludlow Major',
    type: 'interlocking-tile',
    length: 420,
    width: 295,
    eave_tile_length: 0,
    headlap: 100,
    crossbonded: 'NO',
    mingauge: 75, // Default value (CSV: 0)
    maxgauge: 100, // Default value (CSV: 0)
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 0,
  },
  {
    name: 'Sandtoft Shire Pantile',
    type: 'interlocking-tile',
    length: 380,
    width: 200,
    eave_tile_length: 0,
    headlap: 100,
    crossbonded: 'NO',
    mingauge: 75, // Default value (CSV: 0)
    maxgauge: 100, // Default value (CSV: 0)
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 0,
  },
  {
    name: 'Redland Fenland Pantile',
    type: 'interlocking-tile',
    length: 381,
    width: 200,
    eave_tile_length: 0,
    headlap: 100,
    crossbonded: 'NO',
    mingauge: 75, // Default value (CSV: 0)
    maxgauge: 100, // Default value (CSV: 0)
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 0,
  },
  {
    name: 'Tudor Traditional Handmade Clay Plain Tile',
    type: 'plain-tile',
    length: 265,
    width: 165,
    eave_tile_length: 200,
    headlap: 65,
    crossbonded: 'YES',
    mingauge: 100,
    maxgauge: 100,
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 0,
  },
  {
    name: 'Keymer Traditional Handmade Clay Plain Tile',
    type: 'plain-tile',
    length: 265,
    width: 165,
    eave_tile_length: 200,
    headlap: 65,
    crossbonded: 'YES',
    mingauge: 75, // Default value (CSV: 0)
    maxgauge: 100, // Default value (CSV: 0)
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 0,
  },
  {
    name: 'Spicer Handmade Clay Peg Tile',
    type: 'plain-tile',
    length: 255,
    width: 150,
    eave_tile_length: 190,
    headlap: 65,
    crossbonded: 'YES',
    mingauge: 95, // Default value (CSV: 0)
    maxgauge: 110, // Default value (CSV: 0)
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 0,
  },
  {
    name: 'Marley Acme Single Camber',
    type: 'plain-tile',
    length: 265,
    width: 165,
    eave_tile_length: 265,
    headlap: 65,
    crossbonded: 'YES',
    mingauge: 90,
    maxgauge: 110,
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 165,
  },
  {
    name: 'Wolds Clay Pantile',
    type: 'pantile',
    length: 393,
    width: 195,
    eave_tile_length: 0,
    headlap: 70,
    crossbonded: 'NO',
    mingauge: 260,
    maxgauge: 270,
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 245,
  },
  {
    name: 'William Blyth Barco',
    type: 'pantile',
    length: 393,
    width: 195,
    eave_tile_length: 0,
    headlap: 70,
    crossbonded: 'NO',
    mingauge: 265,
    maxgauge: 270,
    minspacing: 1,
    maxspacing: 7,
    datasheet_link: null,
    lhTileWidth: 245,
  },
]);
console.log('Tiles seeded successfully.');

    // Seed a default admin user
    console.log('Seeding admin user...');
    await user.bulkCreate([
      {
        username: 'admin',
        password: '$2b$10$qpjHdIwuhGKo5JPDG5geFu56VnTPiDzZ8UG8JBqm5t2WNKjK16u/G', // Replace with the new hash
        role: 'admin',
        subscription: 'pro',
      },
    ], { validate: true });
    console.log('Admin user seeded successfully.');

    // Verify the user table after seeding
    console.log('Verifying user table...');
    const users = await user.findAll();
    console.log('Users in database:', users.map(u => u.toJSON()));
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error; // Stop the server if initialization fails
  }
};

module.exports = { sequelize, initDb, tile, project, user, userTile };