const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  businessOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
}, { timestamps: true });
schema.index({ businessOwner: 1, freelancer: 1 }, { unique: true });
module.exports = mongoose.model('SavedFreelancer', schema);
