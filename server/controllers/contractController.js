const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Contract = require('../models/Contract');
const Milestone = require('../models/Milestone');
const Project = require('../models/Project');
const notify = require('../utils/notify');
exports.listContracts = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'BUSINESS_OWNER' ? { businessOwner: req.user._id } : { freelancer: req.user._id };
  if (req.query.status) filter.status = req.query.status;
  const data = await Contract.find(filter).populate('project', 'title status').populate('businessOwner', 'name businessName profileImage').populate('freelancer', 'name profileImage').populate('hiringRequest').sort({ createdAt: -1 });
  res.json({ success: true, data });
});
exports.updateContractStatus = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) { res.status(400); throw new Error('Invalid contract id.'); }
  const { status } = req.body;
  if (!['completed','cancelled'].includes(status)) { res.status(400); throw new Error('Status must be completed or cancelled.'); }
  const contract = await Contract.findById(req.params.id);
  if (!contract) { res.status(404); throw new Error('Contract not found.'); }
  if (contract.businessOwner.toString() !== req.user._id.toString()) { res.status(403); throw new Error('Only the business owner can update contract status.'); }
  if (contract.status !== 'active') { res.status(409); throw new Error('Only active contracts can be updated.'); }
  if (status === 'completed') {
    const remaining = await Milestone.countDocuments({ contract: contract._id, status: { $ne: 'completed' } });
    if (remaining > 0) { res.status(400); throw new Error('Complete all milestones before completing the contract.'); }
  }
  contract.status = status; await contract.save();
  if (status === 'completed') await Project.findByIdAndUpdate(contract.project, { status: 'completed' });
  await notify(contract.freelancer, 'contract_update', 'Contract updated', `Contract ${contract.title} was marked ${status}.`, contract._id);
  res.json({ success: true, contract });
});
exports.createMilestone = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) { res.status(400); throw new Error('Invalid contract id.'); }
  const contract = await Contract.findById(req.params.id);
  if (!contract) { res.status(404); throw new Error('Contract not found.'); }
  if (contract.businessOwner.toString() !== req.user._id.toString()) { res.status(403); throw new Error('Only the business owner can add milestones.'); }
  if (contract.status !== 'active') { res.status(400); throw new Error('Milestones can only be added to active contracts.'); }
  const { title, description = '', amount = 0, dueDate } = req.body;
  if (!title) { res.status(400); throw new Error('Milestone title is required.'); }
  const milestone = await Milestone.create({ contract: contract._id, title, description, amount, dueDate: dueDate || null });
  await notify(contract.freelancer, 'milestone', 'New milestone', `A milestone was added to ${contract.title}.`, milestone._id);
  res.status(201).json({ success: true, milestone });
});
exports.listMilestones = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) { res.status(400); throw new Error('Invalid contract id.'); }
  const contract = await Contract.findById(req.params.id);
  if (!contract) { res.status(404); throw new Error('Contract not found.'); }
  if (![contract.businessOwner.toString(), contract.freelancer.toString()].includes(req.user._id.toString())) { res.status(403); throw new Error('You do not have access to these milestones.'); }
  const data = await Milestone.find({ contract: contract._id }).sort({ createdAt: 1 });
  res.json({ success: true, data });
});
exports.updateMilestoneStatus = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.milestoneId)) { res.status(400); throw new Error('Invalid milestone id.'); }
  const milestone = await Milestone.findById(req.params.milestoneId);
  if (!milestone) { res.status(404); throw new Error('Milestone not found.'); }
  const contract = await Contract.findById(milestone.contract);
  if (!contract || contract.freelancer.toString() !== req.user._id.toString()) { res.status(403); throw new Error('Only the assigned freelancer can update milestone progress.'); }
  if (contract.status !== 'active') { res.status(400); throw new Error('Contract is not active.'); }
  const { status } = req.body;
  if (!['in_progress','completed'].includes(status)) { res.status(400); throw new Error('Status must be in_progress or completed.'); }
  milestone.status = status; milestone.completedAt = status === 'completed' ? new Date() : null; await milestone.save();
  await notify(contract.businessOwner, 'milestone_update', 'Milestone progress updated', `${milestone.title} is now ${status}.`, milestone._id);
  res.json({ success: true, milestone });
});
