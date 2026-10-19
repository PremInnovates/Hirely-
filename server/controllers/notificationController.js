const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');
exports.listNotifications = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1), limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);
  const filter = { recipient: req.user._id };
  if (req.query.unread === 'true') filter.isRead = false;
  const [data, total, unreadCount] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip((page-1)*limit).limit(limit),
    Notification.countDocuments(filter),
    Notification.countDocuments({ recipient: req.user._id, isRead: false })
  ]);
  res.json({ success: true, data, unreadCount, pagination: { page, limit, total, pages: Math.ceil(total/limit) } });
});
