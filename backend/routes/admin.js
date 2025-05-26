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

// this is a request to ban
router.post('/ban/:id', verifyToken, async (req, res) => {
  console.log('i happen');
  const admin = await User.findOne({ isAdmin: true });
  if (!admin) {
    return res.status(401).json({ error: 'No admin found' });
  }

  // banning the user w/ the id
  const banModel = new Message({
    sender: req.params.id,
    encryptedMessage: ' ',
    flagged: false,
  });
  await banModel.save();

  // 4. Add this new message to admin's `messages`
  admin.messages.push(banModel);
  await admin.save();
  console.log('ban req!');
  console.log(admin);
  res.json('Ban request made successfuly. ');
});

router.delete('/admin-ban/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;

    console.log('Starting user ban for ID:', userId);

    // Step 1: Delete the user
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(205).json({ message: 'User not found' });
    }
    console.log('oki');
    // Step 2: Remove messages from all admins that were sent by the deleted user
    const adminUsers = await User.find({ isAdmin: true });

    console.log('admin users', adminUsers);
    for (const admin of adminUsers) {
      await admin.populate('messages');
      console.log('admin is', admin);
      const originalLength = admin.messages.length;

      admin.messages = admin.messages.filter(
        (message) => message.sender !== userId,
      );

      console.log(admin.messages);
      if (admin.messages.length !== originalLength) {
        await admin.save();
      }

      console.log('admin messages', admin.messages);
    }

    res.status(200).json({
      message: 'User deleted and messages cleaned from admin inboxes',
      user: deletedUser,
    });
  } catch (error) {
    console.error('Error banning user:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

// PUT /user/role/:id
router.put('/user/role/:id', async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const roleNum = parseInt(role, 10);
  if (![0, 1, 2].includes(roleNum)) {
    return res.status(400).json({ error: 'Invalid role value. Use 0, 1, or 2.' });
  }

  let isAdmin = false;
  let isModerator = false;

  if (roleNum === 1) {
    isModerator = true;
  } else if (roleNum === 2) {
    isAdmin = true;
  }

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isAdmin, isModerator },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ message: 'User role updated successfully.', user });
  } catch (err) {
    res.status(500).json({ error: 'Server error.', details: err.message });
  }
});

module.exports = router;
