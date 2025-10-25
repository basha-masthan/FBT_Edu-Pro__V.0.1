const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  createdAt: { type: Date, default: Date.now }
});

// Add enrollment method
userSchema.methods.enrollInCourse = function(courseId) {
  if (!this.enrolledCourses.includes(courseId)) {
    this.enrolledCourses.push(courseId);
    return this.save();
  }
  return Promise.resolve(this);
};

module.exports = mongoose.model('User', userSchema);