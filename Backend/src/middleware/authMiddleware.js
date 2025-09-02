const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model
const logger = require('../utils/logger');

const authMiddleware = async (req, res, next) => {
  // Extract token from Authorization header (e.g., "Bearer <token>")
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    logger.warn('No authorization header provided', { path: req.path, method: req.method });
    return res.status(401).json({ success: false, message: 'Access Denied! No token provided.' });
  }

  // Check if token includes "Bearer" prefix and extract the token part
  const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : authHeader;

  if (!token) {
    logger.warn('Invalid token format', { authHeader });
    return res.status(401).json({ success: false, message: 'Access Denied! Invalid token format.' });
  }

  try {
    // Verify the token using the JWT_SECRET from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user from database to ensure they still exist (optional but adds security)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      logger.warn('User not found for token', { userId: decoded.id });
      return res.status(401).json({ success: false, message: 'User no longer exists.' });
    }

    if (!user.isVerified) {
      logger.warn('Unverified user attempting access', { userId: user._id, email: user.email });
      return res.status(401).json({ success: false, message: 'Please verify your email first.' });
    }

    // Attach user data to the request object
    req.user = user;
    logger.info('User authenticated successfully', { userId: user._id, email: user.email });
    next();
  } catch (error) {
    logger.error('Token verification error:', { error: error.message, token: token.substring(0, 20) + '...' });
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token has expired. Please log in again.' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token. Please log in again.' });
    }
    
    return res.status(401).json({ success: false, message: 'Invalid or Expired Token' });
  }
};

module.exports = authMiddleware;