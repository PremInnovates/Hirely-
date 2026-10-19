const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
  contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', default: null },
  text: { type: String, required: true, trim: true, maxlength: 5000 },
  readAt: { type: Date, default: null }
}, { timestamps: true });
schema.index({ sender: 1, recipient: 1, createdAt: -1 });
module.exports = mongoose.model('Message', schema);
