const express = require('express');
const Course = require('../models/Course');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('createdBy', 'name');
    res.json(courses);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Create course (admin only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  const { title, description, image, price, duration, modules } = req.body;
  try {
    const course = new Course({ title, description, image, price, duration, modules, createdBy: req.user.id });
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update course (admin only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(course);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete course (admin only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Course deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;