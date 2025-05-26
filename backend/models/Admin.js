import Message from './Message';

const mongoose = require('mongoose');

const Admin = new mongoose.Schema({
  message: MessageSchema,
  encryptedMessage: String,
  timestamp: { type: Date, default: Date.now },
  flagged: { type: Boolean, default: false },
});
module.exports = mongoose.model('Admin', Admin);
