const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { user } = require('../db'); // Already lowercase 'user'

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password, role, subscription } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await user.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await user.create({
      username,
      password: hashedPassword,
      role: role || 'user',
      subscription: subscription || 'free',
    });

    // Generate a JWT token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, role: newUser.role, subscription: newUser.subscription },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const foundUser = await user.findOne({ where: { username } });
    if (!foundUser) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: foundUser.id, username: foundUser.username, role: foundUser.role, subscription: foundUser.subscription },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error });
  }
});

module.exports = router;