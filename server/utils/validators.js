// utils/validators.js
// Small, dependency-free validation helpers shared across controllers.
// Kept framework-agnostic (plain functions returning true/false or a
// message) so they're easy to reuse outside of authController later
// (e.g. project creation, profile updates).

const isValidEmail = (email) => {
  if (typeof email !== 'string') return false;
  // Practical email check - not RFC-5322-complete, but catches real typos.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const isValidPassword = (password) => {
  return typeof password === 'string' && password.length >= 8;
};

const ALLOWED_SELF_REGISTER_ROLES = ['BUSINESS_OWNER', 'FREELANCER'];

const isValidSelfRegisterRole = (role) => ALLOWED_SELF_REGISTER_ROLES.includes(role);

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidSelfRegisterRole,
  ALLOWED_SELF_REGISTER_ROLES,
};
