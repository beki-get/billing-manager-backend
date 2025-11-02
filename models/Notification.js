//models/Notification.js
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
    type: { type: String, enum: ['reminder', 'late_notice', 'summary'], required: true },
    channel: { type: String, enum: ['email', 'sms'], required: true },
    status: { type: String, enum: ['sent', 'failed'], default: 'sent' },
    sentAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
