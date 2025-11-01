const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g. 'INVOICE_GENERATED', 'PAYMENT_SUCCESS'
  entityType: { type: String },             // e.g. 'Invoice', 'Subscription'
  entityId: { type: mongoose.Schema.Types.ObjectId },
  details: { type: Object },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
