const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 10000 },
  category: { type: String, trim: true, default: '' },
  skills: [{ type: String, trim: true }],
  budgetMin: { type: Number, min: 0, default: 0 },
  budgetMax: { type: Number, min: 0, default: 0 },
  deadline: { type: Date, default: null },
  status: { type: String, enum: ['open', 'in_progress', 'completed', 'cancelled'], default: 'open', index: true }
}, { timestamps: true });
projectSchema.index({ title: 'text', description: 'text', skills: 'text' });
module.exports = mongoose.model('Project', projectSchema);
