// controllers/authController.js
// Handles the three Phase 2 auth endpoints. Business logic only - HTTP
// wiring (routes, middleware) lives in routes/authRoutes.js.

const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { isValidEmail, isValidPassword, isValidSelfRegisterRole } = require('../utils/validators');

// @desc    Register a new business owner or freelancer
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, businessName, email, phone, password, confirmPassword, role } = req.body;

  // --- Validation ---
  if (!name || !email || !password || !confirmPassword) {
    res.status(400);
    throw new Error('Name, email, password and confirm password are required.');
  }

  if (!isValidEmail(email)) {
    res.status(400);
    throw new Error('Please provide a valid email address.');
  }

  if (!isValidPassword(password)) {
    res.status(400);
    throw new Error('Password must be at least 8 characters long.');
  }

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error('Password and confirm password do not match.');
  }

  const finalRole = role || 'BUSINESS_OWNER';
  if (!isValidSelfRegisterRole(finalRole)) {
    res.status(400);
    throw new Error('Invalid account type selected.');
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    res.status(400);
    throw new Error('An account with this email already exists.');
  }

  const user = await User.create({
    name: name.trim(),
    businessName: businessName ? businessName.trim() : '',
    email: email.toLowerCase().trim(),
    phone: phone ? phone.trim() : '',
    password,
    role: finalRole,
  });

  const token = generateToken(user._id, user.role);

  res.status(201).json({
    success: true,
    message: 'Account created successfully.',
    token,
    user: user.toJSON(),
  });
});

// @desc    Log in an existing user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required.');
  }

  // password has `select: false` on the schema, so it must be explicitly requested.
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

  // Same generic message whether the email or the password was wrong -
  // avoids revealing which emails are registered.
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password.');
  }

  if (!user.isActive) {
    res.status(401);
    throw new Error('This account has been deactivated.');
  }

  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully.',
    token,
    user: user.toJSON(),
  });
});

// @desc    Get the currently authenticated user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  // req.user is attached by the `protect` middleware.
  res.status(200).json({
    success: true,
    user: req.user.toJSON(),
  });
});

module.exports = { registerUser, loginUser, getMe };
