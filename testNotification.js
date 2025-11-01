// testNotification.js
require('dotenv').config();          // Load environment variables
const mongoose = require('mongoose'); 
const { sendReminders } = require('./services/notificationService');

// Connect to MongoDB first
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    
    // Call your notification function
    await sendReminders();
    
    console.log('Invoice reminders processed.');
    process.exit(0); // Exit the script
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
