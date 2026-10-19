const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Contract = require('../models/Contract');
const Review = require('../models/Review');
const notify = require('../utils/notify');
exports.createReview = asyncHandler(async (req, res) => {
  const { contractId, rating, comment = '' } = req.body;
  if (!contractId || !mongoose.isValidObjectId(contractId)) { res.status(400); throw new Error('Valid contractId is required.'); }
  const numericRating = Number(rating);
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) { res.status(400); throw new Error('Rating must be an integer from 1 to 5.'); }
  const contract = await Contract.findById(contractId);
  if (!contract) { res.status(404); throw new Error('Contract not found.'); }
  if (contract.status !== 'completed') { res.status(400); throw new Error('Only completed contracts can be reviewed.'); }
  const userId = req.user._id.toString();
  let reviewee;
  if (contract.businessOwner.toString() === userId) reviewee = contract.freelancer;
  else if (contract.freelancer.toString() === userId) reviewee = contract.businessOwner;
  else { res.status(403); throw new Error('Only contract participants can submit reviews.'); }
  const existing = await Review.findOne({ contract: contract._id, reviewer: req.user._id });
  if (existing) { res.status(409); throw new Error('You have already reviewed this contract.'); }
  const review = await Review.create({ contract: contract._id, reviewer: req.user._id, reviewee, rating: numericRating, comment });
  await notify(reviewee, 'review', 'New review received', `You received a ${numericRating}-star review.`, review._id);
  res.status(201).json({ success: true, review });
});
