const mongoose = require('mongoose');

const { Schema } = mongoose;
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  isModerator: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  publicKey: { type: String, required: true },
  hasUsedMessage: { type: Boolean, default: false },
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
});
module.exports = mongoose.model('User', UserSchema);
