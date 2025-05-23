const express = require('express');

const router = express.Router();
const User = require('../models/User');
const { verifyToken, requireRole } = require('../utils/auth');

router.get('/users', verifyToken, requireRole('admin'), async (req, res) => {
  const users = await User.find({}, 'username role');
  res.json(users);
});

module.exports = router;
