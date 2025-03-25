const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, role, subscription) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, hashedPassword, 'user', 'free']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, subscription: user.subscription },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ token, role: user.role, subscription: user.subscription });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Subscribe (mock payment)
router.post('/subscribe', async (req, res) => {
  const { userId } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET subscription = $1 WHERE id = $2 RETURNING *',
      ['pro', userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error during subscription:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;