const router = require('express').Router();
const Review = require('../models/Review');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

// POST /api/reviews
router.post('/', protect, async (req, res, next) => {
  try {
    const { projectId, revieweeId, rating, comment, type } = req.body;
    const project = await Project.findById(projectId);
    if (!project || project.status !== 'completed')
      return res.status(400).json({ success: false, message: 'Project must be completed to leave a review' });

    const isClient = project.client.toString() === req.user._id.toString();
    const isDev = project.assignedDeveloper?.toString() === req.user._id.toString();
    if (!isClient && !isDev)
      return res.status(403).json({ success: false, message: 'You are not a participant in this project' });

    const review = await Review.create({ project: projectId, reviewer: req.user._id, reviewee: revieweeId, rating, comment, type });
    res.status(201).json({ success: true, review });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'Review already submitted' });
    next(err);
  }
});

// GET /api/reviews/user/:id
router.get('/user/:id', async (req, res, next) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.id })
      .populate('reviewer', 'name avatar role')
      .populate('project', 'title')
      .sort('-createdAt');
    const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0;
    res.json({ success: true, reviews, avgRating, total: reviews.length });
  } catch (err) { next(err); }
});

module.exports = router;