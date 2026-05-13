//server.js
import 'dotenv/config.js';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import subscriptionManagementRoutes from './routes/subscriptionManagementRoutes.js';
//import { generateRecurringInvoices } from './services/cronJobs.js';
import { startNotificationCron } from './services/cronNotifications.js';
import paymentRoutes from './routes/paymentRoutes.js'; // for creating payment intents
import webhookRoutes from './routes/webhookRoutes.js'; // stripe webhook
console.log('webhookRoutes is:', typeof webhookRoutes);
import reportRoutes from './routes/reportRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import invoiceCron from './services/invoiceCron.js'; // for updating overdue invoices

import invoiceRoutes from './routes/invoiceRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

const app = express();
app.use(cors());
app.use('/webhooks', webhookRoutes);

app.use(express.json());
//generateRecurringInvoices();
startNotificationCron();



// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
   
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
