const AuditLog = require('../models/AuditLog');

const getAuditLogs = async (req, res) => {
  const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(50);
  res.json(logs);
};

const clearAuditLogs = async (req, res) => {
  await AuditLog.deleteMany({});
  res.json({ message: 'All logs cleared' });
};

module.exports = { getAuditLogs, clearAuditLogs };
