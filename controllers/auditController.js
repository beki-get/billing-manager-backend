import { find, deleteMany } from '../models/AuditLog';

const getAuditLogs = async (req, res) => {
  const logs = await find().sort({ timestamp: -1 }).limit(50);
  res.json(logs);
};

const clearAuditLogs = async (req, res) => {
  await deleteMany({});
  res.json({ message: 'All logs cleared' });
};

export default { getAuditLogs, clearAuditLogs };
