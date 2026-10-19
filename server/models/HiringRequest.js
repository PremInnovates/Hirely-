const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  businessOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  message: { type: String, trim: true, maxlength: 3000, default: '' },
  proposedBudget: { type: Number, min: 0, default: 0 },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'cancelled'], default: 'pending', index: true }
}, { timestamps: true });
schema.index({ project: 1, freelancer: 1 }, { unique: true });
module.exports = mongoose.model('HiringRequest', schema);
