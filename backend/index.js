const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const moderationRoutes = require('./routes/moderation');
const adminRoutes = require('./routes/admin');
const usersRoutes = require('./routes/users');
const User = require('./models/User');
const Message = require('./models/Message');

dotenv.config();
const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected!'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('API running');
});

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/moderation', moderationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', usersRoutes);

cron.schedule('59 23 * * *', async () => {
  try {
    await Message.deleteMany({});
    await User.updateMany({}, { $set: { messages: [] } });
    console.log('All messages and user references cleared at 11:59 PM');
  } catch (err) {
    console.error('Cron job error:', err);
  }
});

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
