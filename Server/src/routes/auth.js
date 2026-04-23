const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, generateToken } = require('../middleware/auth');

const validate = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return false;
    }
    return true;
};

const userPayload = (user, token) => ({
    success: true,
    token,
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rank: user.rank,
        rankScore: user.rankScore,
        skills: user.skills,
        avatar: user.avatar,
        createdAt: user.createdAt
    }
});

// POST /api/auth/register
router.post('/register', [
    body('name').trim().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    body('role').isIn(['developer', 'client']),
], async (req, res, next) => {
    if (!validate(req, res)) return;
    try {
        const { name, email, password, role, skills, bio, githubUrl } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }
        const user = await User.create({ name, email, password, role, skills, bio, githubUrl });
        res.status(201).json(userPayload(user, generateToken(user._id)));
    } catch (err) {
        next(err);
    }
});

// POST /api/auth/login
router.post('/login', [
    body('email').isEmail(),
    body('password').notEmpty(),
], async (req, res, next) => {
    if (!validate(req, res)) return;
    try {
        const user = await User.findOne({ email: req.body.email }).select('+password');
        if (!user || !(await user.comparePassword(req.body.password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        res.json(userPayload(user, generateToken(user._id)));
    } catch (err) {
        next(err);
    }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
    res.json({ success: true, user: req.user });
});

module.exports = router;