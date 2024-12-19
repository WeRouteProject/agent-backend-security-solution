require("dotenv").config();
const { Pool } = require('pg');

const POSTGRES_URL = process.env.PG_DATABASE_URL

const pool = new Pool({
    connectionString: POSTGRES_URL
});

const connectToDatabase = async () => {
    try {
      const client = await pool.connect()
      console.log("Successfully Connected to Postgres For Security_Solution");

      client.release();
      return pool;
    } catch (error) {
      console.error("Failed to connect to Postgres:", error);
      throw error;
    }
  };
  
  module.exports = connectToDatabase;