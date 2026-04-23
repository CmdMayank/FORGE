const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { getRankFromScore } = require('../utils/rankCalculator');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ['developer', 'client'], required: true },
  rank: { type: String, enum: ['Apprentice','Junior','Mid','Senior','Lead','Architect','Principal'], default: 'Apprentice' },
  rankScore: { type: Number, default: 0 },
  bio: { type: String, maxlength: 500 },
  skills: [String],
  githubUrl: String,
  portfolioUrl: String,
  completedProjects: { type: Number, default: 0 },
  successRate: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  avatar: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (pwd) {
  return bcrypt.compare(pwd, this.password);
};

userSchema.methods.updateRank = function () {
  this.rank = getRankFromScore(this.rankScore);
};

module.exports = mongoose.model('User', userSchema);