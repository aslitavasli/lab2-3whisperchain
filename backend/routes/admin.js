const express = require('express');
const Message = require('../models/Message');

const router = express.Router();
const User = require('../models/User');
const { verifyToken, requireRole } = require('../utils/auth');

// get all users in db
router.get('/users', verifyToken, requireRole('admin'), async (req, res) => {
  const users = await User.find({}, 'username role');
  res.json(users);
});

router.post('/ban/:id', verifyToken, async (req, res) => {
  const admin = await User.findOne({ isAdmin: true });
  if (!admin) {
    return res.status(401).json({ error: 'No admin found' });
  }
  const banModel = new Message({
    sender: req.params.id,
    encryptedMessage: ' ',
    flagged: false,
  });
  await banModel.save();

  // 4. Add this new message to admin's `messages`
  admin.messages.push(banModel);
  console.log('ban req!');
  res.json('Ban request made successfuly. ');
});
module.exports = router;
