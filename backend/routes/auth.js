const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  const {
    username, password, publicKey,
  } = req.body;

  // check if the username exists
  const exist = await User.findOne({ username });

  if (exist) {
    return res.status(500).json({ message: 'This username already exists. Pick another one!' });
  }
  const hash = await bcrypt.hash(password, 10);
  const user = new User({
    username, passwordHash: hash, publicKey,
  });
  await user.save();
  return res.status(201).json({ message: 'User registered' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('hi');
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = jwt.sign({
    userId: user._id, username: user.username, isAdmin: user.isAdmin, isModerator: user.isModerator,
  }, process.env.JWT_SECRET);
  res.json({ token });
});

module.exports = router;
