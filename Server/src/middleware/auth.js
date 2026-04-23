const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer '))
        return res.status(401).json({ success: false, message: 'No token provided' });

    try {
        const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

const requireRole = (...roles) => (req, res, next) => {
    console.log(`[AUTH DEBUG] Checking access to ${req.originalUrl}`);
    console.log(`[AUTH DEBUG] User: ${req.user ? `${req.user.name} (Role: ${req.user.role})` : 'NULL'}`);
    console.log(`[AUTH DEBUG] Required Roles: [${roles.join(', ')}]`);
    
    if (!req.user || !roles.includes(req.user.role)) {
        console.log(`[AUTH DEBUG] Access Denied: User role [${req.user?.role}] not in [${roles.join(', ')}]`);
        return res.status(403).json({ 
            success: false, 
            message: `Access denied. This action requires one of these roles: ${roles.join(', ')}. Your current role is: ${req.user?.role || 'unknown'}` 
        });
    }
    console.log('[AUTH DEBUG] Access Granted');
    next();
};

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });

module.exports = { protect, requireRole, generateToken };