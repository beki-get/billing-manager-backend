//server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const businessRoutes = require('./routes/businessRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const subscriptionManagementRoutes = require('./routes/subscriptionManagementRoutes');
const { generateRecurringInvoices } = require('./services/cronJobs');
const { startNotificationCron } = require('./services/cronNotifications');
const paymentRoutes = require('./routes/paymentRoutes'); // for creating payment intents
const webhookRoutes = require('./routes/webhookRoutes'); // stripe webhook
console.log('webhookRoutes is:', typeof webhookRoutes);
const reportRoutes = require('./routes/reportRoutes');
const auditRoutes = require('./routes/auditRoutes');

const invoiceRoutes = require('./routes/invoiceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
app.use(cors());
app.use('/webhooks', webhookRoutes);

app.use(express.json());
generateRecurringInvoices();
startNotificationCron();


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Simple test route
app.get('/', (req, res) => {
    res.send('Billing Manager API is running');
});

//routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/plans',subscriptionRoutes);
app.use('/api/subscriptions', subscriptionManagementRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
