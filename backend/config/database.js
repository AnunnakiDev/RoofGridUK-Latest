require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password1234',
    database: process.env.DB_NAME || 'roofgrid_uk',
    host: process.env.DB_HOST || 'localhost', // Changed from 'http://localhost:5000'
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
  },
  test: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password1234',
    database: process.env.DB_NAME || 'roofgrid_uk',
    host: process.env.DB_HOST || 'localhost', // Changed from 'http://localhost:5000'
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
  },
};