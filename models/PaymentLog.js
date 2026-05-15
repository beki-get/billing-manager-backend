import { Schema, model } from 'mongoose';

const PaymentLogSchema = new Schema({
    invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true },
    subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['success', 'failure', 'pending'], default: 'pending' },
    paymentGateway: { type: String, enum: ['stripe', 'paypal'], required: true },
    transactionId: { type: String },
    retryCount: { type: Number, default: 0 }
}, { timestamps: true });

export default model('PaymentLog', PaymentLogSchema);
