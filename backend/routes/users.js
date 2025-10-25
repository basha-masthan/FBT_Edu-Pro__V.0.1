const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all users (admin only)
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete user (admin only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update user (admin only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('enrolledCourses');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Enroll in course
router.post('/enroll/:courseId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if course exists
    const Course = require('../models/Course');
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    await user.enrollInCourse(req.params.courseId);
    res.json({ msg: 'Enrolled successfully' });
  } catch (err) {
    console.error('Enrollment error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;