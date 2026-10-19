const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const User = require('../models/user');

// Any logged-in user (valid JWT)
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'dev-secret-change-me',
    );

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }

    next();
  } catch (err) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

// Must be admin (use AFTER protect)
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403);
  throw new Error('Admin access only');
};

module.exports = { protect, adminOnly };