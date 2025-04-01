const jwt = require('jsonwebtoken');
console.log('jsonwebtoken loaded successfully');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user info to the request
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const checkProUser = (req, res, next) => {
  if (!req.user || req.user.subscription !== 'pro') {
    return res.status(403).json({ message: 'Pro subscription required' });
  }
  next();
};

console.log('middleware/auth.js loaded successfully');
module.exports = { authenticateToken, checkProUser };