// middleware/authMiddleware.js
// `protect` guards any route that requires a logged-in user. Usage:
//   router.get('/me', protect, getMe);
//
// `authorize(...roles)` is a second, optional layer for role-based
// access (e.g. admin-only routes later) - used as: protect, authorize('ADMIN')

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized - no token provided.');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    res.status(401);
    if (err.name === 'TokenExpiredError') {
      throw new Error('Session expired. Please log in again.');
    }
    throw new Error('Not authorized - invalid token.');
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    res.status(401);
    throw new Error('Not authorized - user no longer exists.');
  }
  if (!user.isActive) {
    res.status(401);
    throw new Error('This account has been deactivated.');
  }

  req.user = user; // password is already excluded (select: false on the schema)
  next();
});

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403);
    throw new Error('You do not have permission to perform this action.');
  }
  next();
};

module.exports = { protect, authorize };
