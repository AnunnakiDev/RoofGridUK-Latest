try {
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
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
  };

  console.log('middleware/auth.js loaded successfully');
  module.exports = authenticateToken;
} catch (error) {
  console.error('Error in middleware/auth.js:', error);
  throw error;
}