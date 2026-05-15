import { Schema, model } from 'mongoose';

const SubscriptionPlanSchema = new Schema({
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true }, // in days
    features: [{ type: String }],
}, { timestamps: true });

export default model('SubscriptionPlan', SubscriptionPlanSchema);
