const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all vendors
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vendor');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching vendors');
  }
});

module.exports = router;
