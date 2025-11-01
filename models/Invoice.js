const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'paid', 'failed', 'overdue'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);
