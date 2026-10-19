const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const User = require('../models/User');
const SavedFreelancer = require('../models/SavedFreelancer');
exports.listSaved = asyncHandler(async (req, res) => {
  if (req.user.role !== 'BUSINESS_OWNER') { res.status(403); throw new Error('Only business owners can view saved freelancers.'); }
  const data = await SavedFreelancer.find({ businessOwner: req.user._id }).populate('freelancer', 'name profileImage bio location website skills hourlyRate').sort({ createdAt: -1 });
  res.json({ success: true, data: data.filter(item => item.freelancer) });
});
exports.saveFreelancer = asyncHandler(async (req, res) => {
  if (req.user.role !== 'BUSINESS_OWNER') { res.status(403); throw new Error('Only business owners can save freelancers.'); }
  const { freelancerId } = req.body;
  if (!freelancerId || !mongoose.isValidObjectId(freelancerId)) { res.status(400); throw new Error('Valid freelancerId is required.'); }
  if (freelancerId.toString() === req.user._id.toString()) { res.status(400); throw new Error('You cannot save yourself.'); }
  const freelancer = await User.findOne({ _id: freelancerId, role: 'FREELANCER', isActive: true });
  if (!freelancer) { res.status(404); throw new Error('Freelancer not found.'); }
  const saved = await SavedFreelancer.findOneAndUpdate({ businessOwner: req.user._id, freelancer: freelancerId }, { $setOnInsert: { businessOwner: req.user._id, freelancer: freelancerId } }, { new: true, upsert: true, setDefaultsOnInsert: true });
  res.status(201).json({ success: true, saved });
});
exports.removeSaved = asyncHandler(async (req, res) => {
  if (req.user.role !== 'BUSINESS_OWNER') { res.status(403); throw new Error('Only business owners can remove saved freelancers.'); }
  const freelancerId = req.body.freelancerId || req.query.freelancerId;
  if (!freelancerId || !mongoose.isValidObjectId(freelancerId)) { res.status(400); throw new Error('Provide a valid freelancerId in the request body or query.'); }
  const result = await SavedFreelancer.findOneAndDelete({ businessOwner: req.user._id, freelancer: freelancerId });
  if (!result) { res.status(404); throw new Error('Saved freelancer not found.'); }
  res.json({ success: true, message: 'Freelancer removed from saved list.' });
});
