const express = require('express');

const router = express.Router();
const fs = require('fs');
const path = require('path');
const Message = require('../models/Message');

const User = require('../models/User');
const { verifyToken, requireRole } = require('../utils/auth');

router.post('/send', verifyToken, async (req, res) => {
  const {
    recipientUsername,
    senderUsername,
    encryptedMessage,
  } = req.body;

  // find the user's id from the username
  const sender = await User.findOne({ username: senderUsername });

  if (!sender) {
    return res.status(500).json({ message: 'An error occured. Please log out and try agaisn.' });
  }
  // // check if the user has exhausted their limit?
  // if (sender.hasUsedMessage) {
  //   return res.status(480).json({ message: 'You have reached your message limit. Send again after the session resets.' });
  // }
  // create a new message
  const message = new Message({ sender: sender._id, encryptedMessage });
  await message.save();

  // attach the new message to the recipient's messages
  const recipient = await User.findOne({ username: recipientUsername });
  await recipient.messages.push(message);
  await recipient.save();

  // change the sender's status as message sent
  sender.hasUsedMessage = true;
  await sender.save();

  const logEntry = `[${new Date().toISOString()}] ${sender._id} sent a message to ${recipientUsername}\n`;
  const logPath = path.join(__dirname, '..', 'audit_logs.txt');

  fs.appendFile(logPath, logEntry, (err) => {
    if (err) {
      console.error('Failed to write to audit log:', err);
    }
  });

  return res.json({ message: 'Message sent' });
});

router.get('/inbox/:recipientId', verifyToken, async (req, res) => {
  console.log('hiii');
  const { recipientId } = req.params;
  const user = await User.findById(recipientId)
    .populate({ path: 'messages' });

  if (!user) return res.status(404).json({ message: 'User not found' });
  console.log(user.messages);
  res.json(user.messages);
});

router.post('/flag/:id', verifyToken, async (req, res) => {
  await Message.findByIdAndUpdate(req.params.id, { flagged: true });
  // await Log.create({ action: 'flag_message', role: req.user.role });
  res.json({ message: 'Message flagged' });
});

// if a moderator decides that the message is ok, just change the message's boolean as flagged=true
// (means reviewed=true in moderator's context)
router.post('/change-review-status/:id', verifyToken, async (req, res) => {
  await Message.findByIdAndUpdate(req.params.id, { flagged: true });
  console.log('updated');
  res.json({ message: 'Message reviewed' });
});

module.exports = router;
