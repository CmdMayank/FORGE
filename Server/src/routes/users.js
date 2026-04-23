const router = require('express').Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { getRankProgress } = require('../utils/rankCalculator');

// GET /api/users/leaderboard
router.get('/leaderboard', async (req, res, next) => {
  try {
    const devs = await User.find({ role: 'developer' })
      .select('name avatar rank rankScore completedProjects successRate')
      .sort('-rankScore')
      .limit(10);
    res.json({ success: true, leaderboard: devs });
  } catch (err) { next(err); }
});

// GET /api/users/:id
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const rankInfo = getRankProgress(user.rankScore);
    res.json({ success: true, user, rankInfo });
  } catch (err) { next(err); }
});

// PUT /api/users/:id  (own profile only)
router.put('/:id', protect, async (req, res, next) => {
  try {
    if (req.user._id.toString() !== req.params.id)
      return res.status(403).json({ success: false, message: 'Not authorized' });
    const allowed = ['name', 'bio', 'skills', 'githubUrl', 'portfolioUrl', 'avatar'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password');
    res.json({ success: true, user });
  } catch (err) { next(err); }
});

module.exports = router;