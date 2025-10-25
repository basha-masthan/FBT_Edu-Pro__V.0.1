const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId }], // Array of lesson IDs completed
  completedModules: [{ type: mongoose.Schema.Types.ObjectId }], // Array of module IDs completed
  progressPercentage: { type: Number, default: 0 },
  lastAccessed: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Progress', progressSchema);