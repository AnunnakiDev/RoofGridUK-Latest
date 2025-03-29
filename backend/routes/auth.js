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
const Sequelize = require('sequelize');

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

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

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const foundUser = await user.findOne({ where: { id: userId } });
    if (!foundUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      role: foundUser.role,
      subscription: foundUser.subscription,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  const { username, email } = req.body;
  const userId = req.user.id;

  try {
    // Validate required fields
    if (!username || !email) {
      return res.status(400).json({ message: 'Username and email are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if the username or email is already taken by another user
    const existingUser = await user.findOne({ where: { username, id: { [Sequelize.Op.ne]: userId } } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const existingEmail = await user.findOne({ where: { email, id: { [Sequelize.Op.ne]: userId } } });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Update the user
    const updatedUser = await user.update(
      { username, email },
      { where: { id: userId }, returning: true }
    );

    if (!updatedUser[1][0]) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a new JWT token with updated details
    const token = jwt.sign(
      {
        id: userId,
        username: updatedUser[1][0].username,
        email: updatedUser[1][0].email,
        role: updatedUser[1][0].role,
        subscription: updatedUser[1][0].subscription,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile', error: error.message });
  }
});

// Change user password
router.put('/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    // Validate required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    // Find the user
    const foundUser = await user.findOne({ where: { id: userId } });
    if (!foundUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, foundUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    await user.update(
      { password: hashedNewPassword },
      { where: { id: userId } }
    );

    // Generate a new JWT token
    const token = jwt.sign(
      {
        id: userId,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role,
        subscription: foundUser.subscription,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
});

module.exports = router;