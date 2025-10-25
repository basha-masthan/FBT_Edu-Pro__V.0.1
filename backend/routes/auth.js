const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ name, email, password, role });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = {
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email
      }
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }); // Extended to 7 days
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Verify token
router.get('/verify', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;