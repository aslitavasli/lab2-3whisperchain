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

module.exports = router;
