const AuditLog = require('../models/AuditLog');

const logAction = async (action, entityType, entityId, details = {}, createdBy = null) => {
  try {
    await AuditLog.create({ action, entityType, entityId, details, createdBy });
  } catch (err) {
    console.error('Audit log error:', err.message);
  }
};

module.exports = { logAction };
