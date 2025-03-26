const { Sequelize, DataTypes } = require('sequelize');

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
const tile = require('./models/tiles')(sequelize, DataTypes);
const project = require('./models/project')(sequelize, DataTypes);
const user = require('./models/user')(sequelize, DataTypes);
const userTile = require('./models/userTile')(sequelize, DataTypes);

// Define associations
const models = { tile, project, user, userTile }; // Use lowercase keys
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Sync database
const initDb = async () => {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync the database (drop and recreate tables)
    await sequelize.sync({ force: true });
    console.log('Database synced successfully.');

    // Seed data
    await tile.bulkCreate([
      {
        name: 'Marley Acme Single Camber',
        type: 'tile',
        length: 500,
        width: 250,
        eave_tile_length: null,
        headlap: null,
        crossbonded: 'YES',
        mingauge: 75,
        maxgauge: 205,
        minspacing: 3,
        maxspacing: 7,
        datasheet_link: 'https://www.marley.co.uk/roof-tiles/acme-single-camber',
        lhTileWidth: 150,
      },
    ]);
    console.log('Tiles seeded successfully.');

    // Seed a default admin user
    await user.bulkCreate([
      {
        username: 'admin',
        password: '$2b$10$you2b$10$kXDM2n5omwSKNxrn3M13G..cxj135bdN5iftnlnZQ4g7Vp1KP/zWi', // Replace with a hashed password
        role: 'admin',
        subscription: 'pro',
      },
    ]);
    console.log('Admin user seeded successfully.');
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error; // Stop the server if initialization fails
  }
};

module.exports = { sequelize, initDb, tile, project, user, userTile }; // Export lowercase models