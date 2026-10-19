// utils/generateToken.js
// Signs a JWT carrying the user's id and role. Kept as its own tiny module
// so every controller that needs to issue a token (register, login, and
// later a "refresh"/password-reset flow) calls the same function instead
// of re-implementing jwt.sign with slightly different options each time.

const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = generateToken;
