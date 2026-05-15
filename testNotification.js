import 'dotenv/config';
import mongoose from 'mongoose';
import sendReminders from './services/notificationService.js';

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await sendReminders();
    console.log('Invoice reminders processed.');
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
