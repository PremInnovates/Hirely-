const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Project = require('../models/Project');
const User = require('../models/User');
const HiringRequest = require('../models/HiringRequest');
const Contract = require('../models/Contract');
const notify = require('../utils/notify');
exports.listHiringRequests = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'BUSINESS_OWNER' ? { businessOwner: req.user._id } : { freelancer: req.user._id };
  if (req.query.status) filter.status = req.query.status;
  const data = await HiringRequest.find(filter).populate('project', 'title status budgetMin budgetMax').populate('businessOwner', 'name businessName profileImage').populate('freelancer', 'name profileImage bio').sort({ createdAt: -1 });
  res.json({ success: true, data });
});
exports.createHiringRequest = asyncHandler(async (req, res) => {
  if (req.user.role !== 'BUSINESS_OWNER') { res.status(403); throw new Error('Only business owners can send hiring requests.'); }
  const { projectId, freelancerId, message = '', proposedBudget = 0 } = req.body;
  if (!projectId || !freelancerId || !mongoose.isValidObjectId(projectId) || !mongoose.isValidObjectId(freelancerId)) { res.status(400); throw new Error('Valid projectId and freelancerId are required.'); }
  const project = await Project.findById(projectId);
  if (!project || project.owner.toString() !== req.user._id.toString()) { res.status(404); throw new Error('Project not found or not owned by you.'); }
  if (project.status !== 'open') { res.status(400); throw new Error('Only open projects can be used for hiring requests.'); }
  const freelancer = await User.findOne({ _id: freelancerId, role: 'FREELANCER', isActive: true });
  if (!freelancer) { res.status(404); throw new Error('Active freelancer not found.'); }
  const existing = await HiringRequest.findOne({ project: project._id, freelancer: freelancer._id });
  if (existing) { res.status(409); throw new Error('A hiring request already exists for this freelancer and project.'); }
  const request = await HiringRequest.create({ project: project._id, businessOwner: req.user._id, freelancer: freelancer._id, message, proposedBudget });
  await notify(freelancer._id, 'hiring_request', 'New hiring request', `You received a hiring request for ${project.title}.`, request._id);
  res.status(201).json({ success: true, hiringRequest: request });
});
exports.updateHiringRequestStatus = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) { res.status(400); throw new Error('Invalid hiring request id.'); }
  const { status } = req.body;
  if (!['accepted','rejected','cancelled'].includes(status)) { res.status(400); throw new Error('Status must be accepted, rejected, or cancelled.'); }
  const request = await HiringRequest.findById(req.params.id);
  if (!request) { res.status(404); throw new Error('Hiring request not found.'); }
  const isFreelancer = request.freelancer.toString() === req.user._id.toString();
  const isOwner = request.businessOwner.toString() === req.user._id.toString();
  if ((status === 'accepted' || status === 'rejected') && !isFreelancer) { res.status(403); throw new Error('Only the invited freelancer can accept or reject.'); }
  if (status === 'cancelled' && !isOwner) { res.status(403); throw new Error('Only the business owner can cancel this request.'); }
  if (request.status !== 'pending') { res.status(409); throw new Error('Only pending requests can change status.'); }
  request.status = status; await request.save();
  const recipient = isFreelancer ? request.businessOwner : request.freelancer;
  await notify(recipient, 'hiring_request_update', 'Hiring request updated', `A hiring request was ${status}.`, request._id);
  res.json({ success: true, hiringRequest: request });
});
exports.createContract = asyncHandler(async (req, res) => {
  if (req.user.role !== 'BUSINESS_OWNER') { res.status(403); throw new Error('Only business owners can create contracts.'); }
  const { hiringRequestId, agreedAmount, startDate, endDate, description = '' } = req.body;
  if (!hiringRequestId || !mongoose.isValidObjectId(hiringRequestId) || agreedAmount === undefined || Number(agreedAmount) < 0) { res.status(400); throw new Error('Valid hiringRequestId and agreedAmount are required.'); }
  const request = await HiringRequest.findById(hiringRequestId).populate('project');
  if (!request || request.businessOwner.toString() !== req.user._id.toString()) { res.status(404); throw new Error('Hiring request not found or not owned by you.'); }
  if (request.status !== 'accepted') { res.status(400); throw new Error('The hiring request must be accepted before creating a contract.'); }
  if (await Contract.exists({ hiringRequest: request._id })) { res.status(409); throw new Error('A contract already exists for this hiring request.'); }
  const contract = await Contract.create({ hiringRequest: request._id, project: request.project._id, businessOwner: request.businessOwner, freelancer: request.freelancer, title: request.project.title, description, agreedAmount, startDate: startDate || Date.now(), endDate: endDate || null });
  request.project.status = 'in_progress'; await request.project.save();
  await notify(request.freelancer, 'contract', 'New contract', `A contract was created for ${contract.title}.`, contract._id);
  res.status(201).json({ success: true, contract });
});
