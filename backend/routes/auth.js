const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Load bcryptjs and log any issues
let bcrypt;
try {
  bcrypt = require('bcryptjs');
  console.log('bcryptjs loaded successfully');
} catch (error) {
  console.error('Error loading bcryptjs:', error);
  throw error;
}

const { user } = require('../db');

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password, email, role, subscription } = req.body;

  try {
    console.log('Register attempt for username:', username);

    // Validate required fields
    if (!username || !password || !email) {
      console.log('Missing required fields:', { username, email });
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if the user already exists by username or email
    console.log('Checking if user exists:', username, email);
    const existingUser = await user.findOne({ where: { username } });
    if (existingUser) {
      console.log('User already exists:', username);
      return res.status(400).json({ message: 'Username already exists' });
    }
    const existingEmail = await user.findOne({ where: { email } });
    if (existingEmail) {
      console.log('Email already exists:', email);
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    console.log('Hashing password for user:', username);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully:', hashedPassword);

    // Create the new user
    console.log('Creating new user:', username);
    const newUser = await user.create({
      username,
      password: hashedPassword,
      email,
      role: role || 'user',
      subscription: subscription || 'free',
    });
    console.log('New user created:', newUser.toJSON());

    // Generate a JWT token
    console.log('Generating JWT token for user:', username);
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role, subscription: newUser.subscription },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('JWT token generated:', token);

    // Send the response
    console.log('Sending response with token for user:', username);
    res.json({ token });
    console.log('Response sent successfully');
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log('Login attempt for username:', username);

    // Validate required fields
    if (!username || !password) {
      console.log('Missing required fields:', { username });
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find the user by username
    console.log('Querying user table for username:', username);
    const foundUser = await user.findOne({ where: { username } });
    console.log('Found user:', foundUser ? foundUser.toJSON() : null);
    if (!foundUser) {
      console.log('User not found:', username);
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare the password
    console.log('Comparing password for user:', username);
    const isMatch = await bcrypt.compare(password, foundUser.password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      console.log('Password mismatch for user:', username);
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate a JWT token
    console.log('Generating JWT token for user:', username);
    const token = jwt.sign(
      { id: foundUser.id, username: foundUser.username, email: foundUser.email, role: foundUser.role, subscription: foundUser.subscription },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('JWT token generated:', token);

    // Send the response
    console.log('Sending response with token for user:', username);
    res.json({ token });
    console.log('Response sent successfully');
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

module.exports = router;