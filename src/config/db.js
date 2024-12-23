// src/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create and export a Sequelize instance
const sequelize = new Sequelize(process.env.PG_DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test the connection
const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

// Export both the sequelize instance and the test function
module.exports = { sequelize, connectToDatabase };