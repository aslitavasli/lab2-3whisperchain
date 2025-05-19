import mongoose, { Schema } from 'mongoose';


const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },

  coverUrl: {
    type: String,
    required: true,
  },

  id: String,
});

const UserModel = mongoose.model('User', UserSchema);
export default UserModel;
