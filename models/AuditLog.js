import { Schema, model } from 'mongoose';

const auditLogSchema = new Schema({
  action: { type: String, required: true }, // e.g. 'INVOICE_GENERATED', 'PAYMENT_SUCCESS'
  entityType: { type: String },             // e.g. 'Invoice', 'Subscription'
  entityId: { type: Schema.Types.ObjectId },
  details: { type: Object },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now }
});

export default model('AuditLog', auditLogSchema);
