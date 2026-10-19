const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const User = require('../models/User');
const Review = require('../models/Review');
exports.listFreelancers = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '12', 10), 1), 50);
  const filter = { role: 'FREELANCER', isActive: true };
  if (req.query.search) filter.$or = [
    { name: { $regex: req.query.search, $options: 'i' } },
    { bio: { $regex: req.query.search, $options: 'i' } },
    { location: { $regex: req.query.search, $options: 'i' } }
  ];
  if (req.query.location) filter.location = { $regex: req.query.location, $options: 'i' };
  if (req.query.skill) filter.skills = { $in: [new RegExp(String(req.query.skill), 'i')] };
  const [items, total] = await Promise.all([
    User.find(filter).select('name profileImage bio location website createdAt skills hourlyRate').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    User.countDocuments(filter)
  ]);
  res.json({ success: true, data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});
exports.getFreelancer = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) { res.status(400); throw new Error('Invalid freelancer id.'); }
  const user = await User.findOne({ _id: req.params.id, role: 'FREELANCER', isActive: true }).select('name profileImage bio location website createdAt skills hourlyRate');
  if (!user) { res.status(404); throw new Error('Freelancer not found.'); }
  const reviews = await Review.find({ reviewee: user._id }).populate('reviewer', 'name profileImage').sort({ createdAt: -1 }).limit(20).lean();
  const aggregate = await Review.aggregate([{ $match: { reviewee: user._id } }, { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } }]);
  res.json({ success: true, freelancer: user, rating: aggregate[0] ? Number(aggregate[0].average.toFixed(1)) : 0, reviewCount: aggregate[0]?.count || 0, reviews });
});
