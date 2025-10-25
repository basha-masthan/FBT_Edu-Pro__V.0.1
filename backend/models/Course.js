const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  type: { type: String, enum: ['text', 'video'], required: true },
  title: { type: String, required: true },
  content: { type: String, required: true }, // Text content for text lessons, video URL for video lessons
  duration: { type: Number, required: true }, // Duration in minutes
  videoUrl: { type: String } // Only for video lessons
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // Course card logo
  price: { type: Number, required: true },
  duration: { type: String, required: true }, // e.g., "4 months"
  modules: [moduleSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);