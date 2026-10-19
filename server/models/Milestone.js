const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, trim: true, default: '' },
  amount: { type: Number, min: 0, default: 0 },
  dueDate: { type: Date, default: null },
  status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
  completedAt: { type: Date, default: null }
}, { timestamps: true });
module.exports = mongoose.model('Milestone', schema);
