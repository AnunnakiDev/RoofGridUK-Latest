const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator'); // Add this import
const { authenticateToken } = require('../middleware/auth');
const { user, passwordResetToken } = require('../db');
require('dotenv').config();

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

// Rate limiter for login and forgot password attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 attempts per window
  message: 'Too many attempts from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }
  next();
};

// POST /register - Register a new user
router.post(
  '/register',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
      .trim(),
  ],
  handleValidationErrors,
  async (req, res) => {
    const { email, password } = req.body;
    console.log(`Received registration request for email: ${email}`);
    try {
      const existingUser = await user.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = await user.create({
        email,
        password: hashedPassword,
        role: 'user',
        subscription: 'basic',
      });
      const token = jwt.sign(
        { id: newUser.id, role: newUser.role, subscription: newUser.subscription, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.status(201).json({ token });
    } catch (error) {
      console.error('Error during registration:', error.message);
      res.status(500).json({ message: 'Error during registration', error: error.message });
    }
  }
);

// POST /login - Login a user with rate limiting
router.post(
  '/login',
  loginLimiter,
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .trim(),
  ],
  handleValidationErrors,
  async (req, res) => {
    const { email, password } = req.body;
    console.log(`Received login request for email: ${email}`);
    try {
      const existingUser = await user.findOne({ where: { email } });
      if (!existingUser) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign(
        { id: existingUser.id, role: existingUser.role, subscription: existingUser.subscription, email: existingUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ token });
    } catch (error) {
      console.error('Error during login:', error.message);
      res.status(500).json({ message: 'Error during login', error: error.message });
    }
  }
);

// POST /forgot-password - Request a password reset with rate limiting
router.post(
  '/forgot-password',
  loginLimiter,
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
  ],
  handleValidationErrors,
  async (req, res) => {
    const { email } = req.body;
    console.log(`Received password reset request for email: ${email}`);
    try {
      const existingUser = await user.findOne({ where: { email } });
      if (!existingUser) {
        return res.status(404).json({ message: 'Email not found' });
      }

      // Generate a reset token
      const token = jwt.sign(
        { userId: existingUser.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Save the reset token to the database
      await passwordResetToken.create({
        userId: existingUser.id,
        token,
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      });

      // Send the reset email
      const resetLink = `http://localhost:3000/reset-password?token=${token}`;
      const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: 'Password Reset Request - RoofGrid UK',
        text: `You requested a password reset for your RoofGrid UK account. Click the link below to reset your password:\n\n${resetLink}\n\nThis link will expire in 1 hour. If you did not request a password reset, please ignore this email.`,
        html: `
          <h1>Password Reset Request</h1>
          <p>You requested a password reset for your RoofGrid UK account.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
      res.json({ message: 'Password reset email sent. Please check your inbox.' });
    } catch (error) {
      console.error('Error sending password reset email:', error.message);
      res.status(500).json({ message: 'Error sending password reset email', error: error.message });
    }
  }
);

// POST /reset-password - Reset the password using a token
router.post(
  '/reset-password',
  [
    body('token')
      .notEmpty()
      .withMessage('Token is required')
      .trim(),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
      .trim(),
  ],
  handleValidationErrors,
  async (req, res) => {
    const { token, newPassword } = req.body;
    console.log('Received password reset request with token');
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const resetToken = await passwordResetToken.findOne({ where: { token } });
      if (!resetToken) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }

      // Check if the token has expired
      if (new Date() > new Date(resetToken.expiresAt)) {
        await resetToken.destroy();
        return res.status(400).json({ message: 'Token has expired' });
      }

      // Check if the user exists
      const existingUser = await user.findOne({ where: { id: resetToken.userId } });
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Hash the new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update the user's password
      await user.update(
        { password: hashedPassword },
        { where: { id: resetToken.userId } }
      );

      // Delete the reset token
      await resetToken.destroy();

      console.log(`Password reset successfully for user ${resetToken.userId}`);
      res.json({ message: 'Password reset successfully. You can now log in with your new password.' });
    } catch (error) {
      console.error('Error resetting password:', error.message);
      if (error.name === 'TokenExpiredError') {
        return res.status(400).json({ message: 'Token has expired' });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(400).json({ message: 'Invalid token' });
      }
      res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
  }
);

// POST /change-password - Change password for logged-in user
router.post(
  '/change-password',
  authenticateToken,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required')
      .trim(),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
      .trim(),
  ],
  handleValidationErrors,
  async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
      console.log(`Received password change request for user ${userId}`);

      // Find the user
      const existingUser = await user.findOne({ where: { id: userId } });
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Verify the current password
      const isMatch = await bcrypt.compare(currentPassword, existingUser.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Hash the new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update the user's password
      await user.update(
        { password: hashedPassword },
        { where: { id: userId } }
      );

      console.log(`Password changed successfully for user ${userId}`);
      res.json({ message: 'Password changed successfully. Please log in again.' });
    } catch (error) {
      console.error('Error changing password:', error.message);
      res.status(500).json({ message: 'Error changing password', error: error.message });
    }
  }
);

module.exports = router;