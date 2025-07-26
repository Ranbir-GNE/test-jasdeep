// db.js
require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test connection
pool.connect()
  .then(client => {
    console.log('Connected to Supabase database successfully!');
    client.release();
  })
  .catch(err => {
    console.error('Failed to connect to Supabase database:', err);
  });

module.exports = pool;
