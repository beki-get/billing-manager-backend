import { Schema, model } from 'mongoose';

const SubscriptionSchema = new Schema({
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
    planId: { type: Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
    customerEmail: { type: String, required: true },
    startDate: { type: Date, default: Date.now },
    nextBillingDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'paused', 'canceled'], default: 'active' },
    retries: { type: Number, default: 0 },
    gracePeriodEnd: { type: Date }
}, { timestamps: true });

export default model('Subscription', SubscriptionSchema);
