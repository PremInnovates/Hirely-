const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  message: { type: String, trim: true, default: '' },
  relatedId: { type: mongoose.Schema.Types.ObjectId, default: null },
  isRead: { type: Boolean, default: false, index: true }
}, { timestamps: true });
module.exports = mongoose.model('Notification', schema);
