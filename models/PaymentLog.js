const mongoose = require('mongoose');

const PaymentLogSchema = new mongoose.Schema({
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['success', 'failure', 'pending'], default: 'pending' },
    paymentGateway: { type: String, enum: ['stripe', 'paypal'], required: true },
    transactionId: { type: String },
    retryCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('PaymentLog', PaymentLogSchema);
