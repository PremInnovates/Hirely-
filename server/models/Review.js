const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true, maxlength: 2000, default: '' }
}, { timestamps: true });
schema.index({ contract: 1, reviewer: 1 }, { unique: true });
module.exports = mongoose.model('Review', schema);
