const router = require('express').Router();
const Project = require('../models/Project');
const User = require('../models/User');
const { protect, requireRole } = require('../middleware/auth');
const { canApply, calcProjectScore } = require('../utils/rankCalculator');

// GET /api/projects  (public with filters)
router.get('/', async (req, res, next) => {
  try {
    const { status = 'open', category, requiredRank, minBudget, maxBudget, complexity, search, sort = '-createdAt', page = 1, limit = 12 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (requiredRank) filter.requiredRank = requiredRank;
    if (complexity) filter.complexity = complexity;
    if (minBudget || maxBudget) {
      filter['budget.max'] = { $gte: Number(minBudget) || 0 };
      if (maxBudget) filter['budget.min'] = { $lte: Number(maxBudget) };
    }
    if (search) filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { skills: { $regex: search, $options: 'i' } },
    ];

    const total = await Project.countDocuments(filter);
    const projects = await Project.find(filter)
      .populate('client', 'name avatar')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    res.json({ success: true, total, pages: Math.ceil(total / limit), projects });
  } catch (err) { next(err); }
});

// GET /api/projects/:id
router.get('/:id', async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true })
      .populate('client', 'name avatar rank')
      .populate('assignedDeveloper', 'name avatar rank')
      .populate('proposals.developer', 'name avatar rank rankScore completedProjects');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, project });
  } catch (err) { next(err); }
});

// POST /api/projects  (client only)
router.post('/', protect, requireRole('client'), async (req, res, next) => {
  try {
    const project = await Project.create({ ...req.body, client: req.user._id });
    res.status(201).json({ success: true, project });
  } catch (err) { next(err); }
});

// PUT /api/projects/:id  (client, own, open only)
router.put('/:id', protect, requireRole('client'), async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, client: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (project.status !== 'open') return res.status(400).json({ success: false, message: 'Can only edit open projects' });
    Object.assign(project, req.body);
    await project.save();
    res.json({ success: true, project });
  } catch (err) { next(err); }
});

// DELETE /api/projects/:id
router.delete('/:id', protect, requireRole('client'), async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, client: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Not found' });
    if (project.status !== 'open') return res.status(400).json({ success: false, message: 'Cannot delete active project' });
    await project.deleteOne();
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) { next(err); }
});

// POST /api/projects/:id/proposals  (developer, rank gated)
router.post('/:id/proposals', protect, requireRole('developer'), async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (project.status !== 'open') return res.status(400).json({ success: false, message: 'Project is not accepting proposals' });
    if (!canApply(req.user.rank, project.requiredRank))
      return res.status(403).json({ success: false, message: `This project requires ${project.requiredRank} rank or above` });
    const already = project.proposals.find(p => p.developer.toString() === req.user._id.toString());
    if (already) return res.status(400).json({ success: false, message: 'Already submitted a proposal' });

    project.proposals.push({ developer: req.user._id, ...req.body });
    await project.save();
    res.status(201).json({ success: true, message: 'Proposal submitted' });
  } catch (err) { next(err); }
});

// PUT /api/projects/:id/proposals/:pid  (client accept/reject)
router.put('/:id/proposals/:pid', protect, requireRole('client'), async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, client: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Not found' });
    const proposal = project.proposals.id(req.params.pid);
    if (!proposal) return res.status(404).json({ success: false, message: 'Proposal not found' });

    proposal.status = req.body.status;

    if (req.body.status === 'accepted') {
      project.assignedDeveloper = proposal.developer;
      project.status = 'in_progress';
      project.proposals.forEach(p => { if (p._id.toString() !== req.params.pid) p.status = 'rejected'; });
    }

    await project.save();
    res.json({ success: true, project });
  } catch (err) { next(err); }
});

// PUT /api/projects/:id/complete  (client marks done → triggers rank update)
router.put('/:id/complete', protect, requireRole('client'), async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, client: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Not found' });
    if (project.status !== 'in_progress') return res.status(400).json({ success: false, message: 'Project is not in progress' });

    project.status = 'completed';
    project.completedAt = new Date();
    await project.save();

    const { rating = 5, comment = 'Excellent work!' } = req.body;

    // Update developer stats
    if (project.assignedDeveloper) {
      const dev = await User.findById(project.assignedDeveloper);
      const { calcProjectScore } = require('../utils/rankCalculator');
      const scoreGained = calcProjectScore(project.complexity, rating);
      dev.rankScore += scoreGained;
      dev.completedProjects += 1;
      dev.totalEarnings += project.budget.max; // use max as paid amount
      const prevProjects = dev.completedProjects - 1;
      dev.successRate = Math.round(((prevProjects * (dev.successRate / 100) + 1) / dev.completedProjects) * 100);
      dev.updateRank();
      await dev.save();

      // Create a Review entry
      const Review = require('../models/Review');
      await Review.create({
        project: project._id,
        reviewer: req.user._id,
        reviewee: project.assignedDeveloper,
        rating,
        comment,
        type: 'client-to-dev'
      });
    }

    res.json({ success: true, message: 'Project completed and review submitted', project });
  } catch (err) { next(err); }
});

module.exports = router;