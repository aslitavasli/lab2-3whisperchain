const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: String,
  encryptedMessage: String,
  timestamp: { type: Date, default: Date.now },
  flagged: { type: Boolean, default: false },
});
module.exports = mongoose.model('Message', MessageSchema);
