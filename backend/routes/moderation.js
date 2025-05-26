const express = require('express');
const User = require('../models/User');

const router = express.Router();
const Message = require('../models/Message');
const { verifyToken } = require('../utils/auth');

router.get('/flagged', verifyToken, async (req, res) => {
  const flagged = await Message.find({ flagged: true });
  res.json(flagged);
});

router.post('/report', verifyToken, async (req, res) => {
  const {
    message: encryptedMessage, 
    id, 
    sender, 
    modID,
  } = req.body;
  console.log('id is', id);
  try {
    // Find the specific moderator by ID
    const moderator = await User.findById(modID);
 
    if (!moderator || !moderator.isModerator) {
      return res.status(231).json({ error: 'Moderator not found or not valid.' });
    }

    // 3. Create a new message for the moderator's inbox
    const reportMessage = new Message({
      sender,
      encryptedMessage,
    });
    await reportMessage.save();

    // 4. Add this new message to moderator's `messages`
    moderator.messages.push(reportMessage._id);
    await moderator.save();

    // Mark the og message as flagged
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { flagged: true },
      { new: true },
    );

    if (!updatedMessage) {
      return res.status(404).json({ error: 'Original message not found.' });
    }

    res.json({ success: true, moderatorId: moderator._id, flaggedMessage: updatedMessage });
  } catch (err) {
    console.error('Error reporting message:', err);
    res.status(500).json({ error: 'Server error while reporting message.' });
  }
});

router.get('/mod-pub-key', verifyToken, async (req, res) => {
  try {
    const moderator = await User.findOne({ isModerator: true }, 'publicKey');
    if (!moderator) {
      return res.status(404).json({ error: 'No moderator found' });
    }
    res.json({ publicKey: moderator.publicKey, id: moderator._id });
  } catch (err) {
    res.status(500).json({ error: 'Server error while retrieving public key.' });
  }
});

module.exports = router;
