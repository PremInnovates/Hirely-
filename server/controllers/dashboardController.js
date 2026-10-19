const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const HiringRequest = require('../models/HiringRequest');
const Contract = require('../models/Contract');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const SavedFreelancer = require('../models/SavedFreelancer');
exports.getDashboard = asyncHandler(async (req, res) => {
  const id = req.user._id;
  let stats = {}, recentProjects = [], recentHiringRequests = [], recentContracts = [];
  if (req.user.role === 'BUSINESS_OWNER') {
    const [totalProjects, openProjects, activeContracts, pendingRequests, savedCount, unreadMessages, unreadNotifications] = await Promise.all([
      Project.countDocuments({ owner: id }), Project.countDocuments({ owner: id, status: 'open' }), Contract.countDocuments({ businessOwner: id, status: 'active' }),
      HiringRequest.countDocuments({ businessOwner: id, status: 'pending' }), SavedFreelancer.countDocuments({ businessOwner: id }),
      Message.countDocuments({ recipient: id, readAt: null }), Notification.countDocuments({ recipient: id, isRead: false })
    ]);
    [recentProjects, recentHiringRequests, recentContracts] = await Promise.all([
      Project.find({ owner: id }).sort({ createdAt: -1 }).limit(5).lean(),
      HiringRequest.find({ businessOwner: id }).populate('project', 'title').populate('freelancer', 'name profileImage').sort({ createdAt: -1 }).limit(5).lean(),
      Contract.find({ businessOwner: id }).populate('project', 'title').populate('freelancer', 'name profileImage').sort({ createdAt: -1 }).limit(5).lean()
    ]);
    stats = { totalProjects, openProjects, activeContracts, pendingRequests, savedFreelancers: savedCount, unreadMessages, unreadNotifications };
  } else {
    const [receivedRequests, pendingRequests, activeContracts, completedContracts, unreadMessages, unreadNotifications] = await Promise.all([
      HiringRequest.countDocuments({ freelancer: id }), HiringRequest.countDocuments({ freelancer: id, status: 'pending' }),
      Contract.countDocuments({ freelancer: id, status: 'active' }), Contract.countDocuments({ freelancer: id, status: 'completed' }),
      Message.countDocuments({ recipient: id, readAt: null }), Notification.countDocuments({ recipient: id, isRead: false })
    ]);
    [recentHiringRequests, recentContracts] = await Promise.all([
      HiringRequest.find({ freelancer: id }).populate('project', 'title').populate('businessOwner', 'name businessName profileImage').sort({ createdAt: -1 }).limit(5).lean(),
      Contract.find({ freelancer: id }).populate('project', 'title').populate('businessOwner', 'name businessName profileImage').sort({ createdAt: -1 }).limit(5).lean()
    ]);
    stats = { receivedRequests, pendingRequests, activeContracts, completedContracts, unreadMessages, unreadNotifications };
  }
  res.json({ success: true, stats, recentProjects, recentHiringRequests, recentContracts });
});
