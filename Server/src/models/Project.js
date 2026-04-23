const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  developer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, required: true, maxlength: 1000 },
  bidAmount: { type: Number, required: true },
  estimatedDays: { type: Number, required: true },
  status: { type: String, enum: ['pending','accepted','rejected'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedDeveloper: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  requiredRank: { type: String, enum: ['Apprentice','Junior','Mid','Senior','Lead','Architect','Principal'], required: true },
  skills: [String],
  budget: { min: { type: Number, required: true }, max: { type: Number, required: true } },
  timeline: { type: Number, required: true },
  status: { type: String, enum: ['open','in_progress','completed','cancelled'], default: 'open' },
  proposals: [proposalSchema],
  category: { type: String, enum: ['Web Development','Mobile Development','Backend / API','DevOps / Cloud','Machine Learning / AI','Blockchain','Game Development','Open Source','Other'], required: true },
  complexity: { type: String, enum: ['Low','Medium','High','Expert'], required: true },
  views: { type: Number, default: 0 },
  completedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

projectSchema.pre('save', function (next) { this.updatedAt = Date.now(); next(); });
projectSchema.index({ requiredRank: 1, status: 1 });
projectSchema.index({ category: 1 });

module.exports = mongoose.model('Project', projectSchema);