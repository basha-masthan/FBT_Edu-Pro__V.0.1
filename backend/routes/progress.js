const express = require('express');
const Progress = require('../models/Progress');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user progress for a course
router.get('/:courseId', auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user.id, course: req.params.courseId });
    res.json(progress);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Mark lesson as completed
router.post('/:courseId/lesson/:lessonId', auth, async (req, res) => {
  try {
    let progress = await Progress.findOne({ user: req.user.id, course: req.params.courseId });
    if (!progress) {
      progress = new Progress({ user: req.user.id, course: req.params.courseId, completedLessons: [], completedModules: [], progressPercentage: 0 });
    }

    if (!progress.completedLessons.includes(req.params.lessonId)) {
      progress.completedLessons.push(req.params.lessonId);
      progress.lastAccessed = new Date();

      // Calculate progress percentage
      const Course = require('../models/Course');
      const course = await Course.findById(req.params.courseId);
      const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
      progress.progressPercentage = Math.round((progress.completedLessons.length / totalLessons) * 100);

      // Check if module is completed
      const lesson = course.modules.flatMap(mod => mod.lessons).find(l => l._id.toString() === req.params.lessonId);
      if (lesson) {
        const module = course.modules.find(mod => mod.lessons.some(l => l._id.toString() === req.params.lessonId));
        const moduleLessons = module.lessons.map(l => l._id.toString());
        const completedModuleLessons = progress.completedLessons.filter(l => moduleLessons.includes(l));
        if (completedModuleLessons.length === moduleLessons.length && !progress.completedModules.includes(module._id.toString())) {
          progress.completedModules.push(module._id.toString());
        }
      }

      await progress.save();
    }
    res.json(progress);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update progress (legacy)
router.post('/:courseId', auth, async (req, res) => {
  const { completedLessons, progressPercentage } = req.body;
  try {
    let progress = await Progress.findOne({ user: req.user.id, course: req.params.courseId });
    if (!progress) {
      progress = new Progress({ user: req.user.id, course: req.params.courseId, completedLessons, progressPercentage });
    } else {
      progress.completedLessons = completedLessons;
      progress.progressPercentage = progressPercentage;
      progress.lastAccessed = new Date();
    }
    await progress.save();
    res.json(progress);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;