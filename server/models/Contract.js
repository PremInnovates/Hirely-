const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  hiringRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'HiringRequest', required: true, unique: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  businessOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, trim: true, default: '' },
  agreedAmount: { type: Number, required: true, min: 0 },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: null },
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active', index: true }
}, { timestamps: true });
module.exports = mongoose.model('Contract', schema);
