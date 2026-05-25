import { Schema, model } from 'mongoose';

const NotificationSchema = new Schema({
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
    subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription' },
    invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice' },
    type: { type: String, enum: ['reminder', 'late_notice', 'summary'], required: true },
    channel: { type: String, enum: ['email', 'sms'], required: true },
    status: { type: String, enum: ['sent', 'failed'], default: 'sent' },
    sentAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default model('Notification', NotificationSchema);
