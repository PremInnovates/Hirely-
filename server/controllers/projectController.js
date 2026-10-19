const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Project = require('../models/Project');
const Contract = require('../models/Contract');
const HiringRequest = require('../models/HiringRequest');
const notify = require('../utils/notify');
function validId(id) { return mongoose.isValidObjectId(id); }
exports.listProjects = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1), limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 50);
  const filter = req.user.role === 'BUSINESS_OWNER' ? { owner: req.user._id } : { status: 'open' };
  if (req.query.status && req.user.role === 'BUSINESS_OWNER') filter.status = req.query.status;
  if (req.query.search) filter.$or = [{ title: { $regex: req.query.search, $options: 'i' } }, { description: { $regex: req.query.search, $options: 'i' } }];
  if (req.query.skill) filter.skills = { $in: [new RegExp(String(req.query.skill), 'i')] };
  const [data, total] = await Promise.all([Project.find(filter).populate('owner', 'name businessName profileImage').sort({ createdAt: -1 }).skip((page-1)*limit).limit(limit).lean(), Project.countDocuments(filter)]);
  res.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total/limit) } });
});
exports.createProject = asyncHandler(async (req, res) => {
  const { title, description, category, skills, budgetMin = 0, budgetMax = 0, deadline } = req.body;
  if (!title || !description) { res.status(400); throw new Error('Title and description are required.'); }
  if (Number(budgetMin) < 0 || Number(budgetMax) < 0 || (Number(budgetMax) && Number(budgetMax) < Number(budgetMin))) { res.status(400); throw new Error('Please provide a valid budget range.'); }
  const project = await Project.create({ owner: req.user._id, title, description, category, skills: Array.isArray(skills) ? skills : (typeof skills === 'string' ? skills.split(',').map(s=>s.trim()).filter(Boolean) : []), budgetMin, budgetMax, deadline: deadline || null });
  res.status(201).json({ success: true, project });
});
exports.getProject = asyncHandler(async (req, res) => {
  if (!validId(req.params.id)) { res.status(400); throw new Error('Invalid project id.'); }
  const project = await Project.findById(req.params.id).populate('owner', 'name businessName profileImage');
  if (!project) { res.status(404); throw new Error('Project not found.'); }
  const isOwner = project.owner._id.toString() === req.user._id.toString();
  if (!isOwner && project.status !== 'open') {
    const contract = await Contract.exists({ project: project._id, $or: [{ businessOwner: req.user._id }, { freelancer: req.user._id }] });
    if (!contract) { res.status(403); throw new Error('You do not have access to this project.'); }
  }
  res.json({ success: true, project });
});
exports.updateProject = asyncHandler(async (req, res) => {
  if (!validId(req.params.id)) { res.status(400); throw new Error('Invalid project id.'); }
  const project = await Project.findById(req.params.id);
  if (!project) { res.status(404); throw new Error('Project not found.'); }
  if (project.owner.toString() !== req.user._id.toString()) { res.status(403); throw new Error('Only the project owner can update it.'); }
  const fields = ['title','description','category','skills','budgetMin','budgetMax','deadline','status'];
  for (const f of fields) if (req.body[f] !== undefined) project[f] = req.body[f];
  await project.save();
  res.json({ success: true, message: 'Project updated.', project });
});
exports.deleteProject = asyncHandler(async (req, res) => {
  if (!validId(req.params.id)) { res.status(400); throw new Error('Invalid project id.'); }
  const project = await Project.findById(req.params.id);
  if (!project) { res.status(404); throw new Error('Project not found.'); }
  if (project.owner.toString() !== req.user._id.toString()) { res.status(403); throw new Error('Only the project owner can delete it.'); }
  const linked = await Contract.exists({ project: project._id, status: { $in: ['active'] } });
  if (linked) { res.status(409); throw new Error('Cannot delete a project with an active contract.'); }
  await HiringRequest.deleteMany({ project: project._id }); await project.deleteOne();
  res.json({ success: true, message: 'Project deleted.' });
});
