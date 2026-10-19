const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User');
const Contract = require('../models/Contract');
const HiringRequest = require('../models/HiringRequest');
const notify = require('../utils/notify');
exports.listMessages = asyncHandler(async (req, res) => {
  const filter = { $or: [{ sender: req.user._id }, { recipient: req.user._id }] };
  if (req.query.with) {
    if (!mongoose.isValidObjectId(req.query.with)) { res.status(400); throw new Error('Invalid conversation user id.'); }
    filter.$and = [{ $or: [{ sender: req.user._id, recipient: req.query.with }, { sender: req.query.with, recipient: req.user._id }] }];
  }
  if (req.query.projectId) {
    if (!mongoose.isValidObjectId(req.query.projectId)) { res.status(400); throw new Error('Invalid project id.'); }
    filter.project = req.query.projectId;
  }
  const data = await Message.find(filter).populate('sender', 'name profileImage').populate('recipient', 'name profileImage').populate('project', 'title').sort({ createdAt: 1 }).limit(500);
  await Message.updateMany({ recipient: req.user._id, readAt: null, ...(req.query.with ? { sender: req.query.with } : {}) }, { $set: { readAt: new Date() } });
  res.json({ success: true, data });
});
exports.sendMessage = asyncHandler(async (req, res) => {
  const { recipientId, text, projectId, contractId } = req.body;
  if (!recipientId || !mongoose.isValidObjectId(recipientId) || !text || !String(text).trim()) { res.status(400); throw new Error('Valid recipientId and message text are required.'); }
  if (recipientId.toString() === req.user._id.toString()) { res.status(400); throw new Error('You cannot message yourself.'); }
  const recipient = await User.findOne({ _id: recipientId, isActive: true });
  if (!recipient) { res.status(404); throw new Error('Recipient not found.'); }
  const relationFilter = { $or: [ { businessOwner: req.user._id, freelancer: recipientId }, { businessOwner: recipientId, freelancer: req.user._id } ] };
  const relatedContract = await Contract.exists({ ...relationFilter, ...(contractId && mongoose.isValidObjectId(contractId) ? { _id: contractId } : {}) });
  const relatedRequest = await HiringRequest.exists({ ...relationFilter, ...(projectId && mongoose.isValidObjectId(projectId) ? { project: projectId } : {}) });
  if (!relatedContract && !relatedRequest) { res.status(403); throw new Error('Messaging is available only between users connected by a hiring request or contract.'); }
  const message = await Message.create({ sender: req.user._id, recipient: recipientId, text: String(text).trim(), project: projectId || null, contract: contractId || null });
  await notify(recipientId, 'message', 'New message', `You received a message from ${req.user.name}.`, message._id);
  res.status(201).json({ success: true, message });
});
