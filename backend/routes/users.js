const express = require('express');

const router = express.Router();
const User = require('../models/User');

router.get('/all', async (req, res) => {
  const users = await User.find({
    isModerator: false,
    isAdmin: false,
  }).select('username publicKey');

  res.json(users);
});

router.get('/all-admin', async (req, res) => {
  try {
    const users = await User.find().select('username publicKey isAdmin isModerator');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
