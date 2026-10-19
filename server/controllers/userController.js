const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const editableFields = ['name', 'businessName', 'phone', 'profileImage', 'bio', 'location', 'website'];
exports.getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toJSON() });
});
exports.updateProfile = asyncHandler(async (req, res) => {
  const updates = {};
  for (const field of editableFields) if (req.body[field] !== undefined) updates[field] = req.body[field];
  if (updates.name !== undefined && !String(updates.name).trim()) { res.status(400); throw new Error('Name cannot be empty.'); }
  const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true, runValidators: true });
  res.json({ success: true, message: 'Profile updated.', user: user.toJSON() });
});
