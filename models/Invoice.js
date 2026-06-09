import { Schema, model } from 'mongoose';

const InvoiceSchema = new Schema({
    subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription', required: true },
    customerName: { type: String,  required: true   }, 
    customerEmail: {  type: String,   required: true },      
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'ETB' },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'paid', 'failed', 'overdue'], default: 'pending' }
}, { timestamps: true });

export default model('Invoice', InvoiceSchema);
