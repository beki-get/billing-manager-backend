//controller
const Invoice = require('../models/Invoice');
const Subscription = require('../models/Subscription');
const { Parser } = require('json2csv');

// Calculate date range helper
const getDateRange = (period) => {
  const now = new Date();
  let start;
  if (period === 'daily') start = new Date(now.setHours(0, 0, 0, 0));
  if (period === 'weekly') start = new Date(now.setDate(now.getDate() - 7));
  if (period === 'monthly') start = new Date(now.setMonth(now.getMonth() - 1));
  return start;
};

// ---------- MAIN REPORT FUNCTIONS ----------

// Revenue summary
const getRevenueSummary = async (req, res) => {
  const { period = 'monthly' } = req.query;
  const startDate = getDateRange(period);

  const invoices = await Invoice.find({
    status: 'paid',
    createdAt: { $gte: startDate },
  });

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  res.json({ period, totalRevenue, count: invoices.length });
};

// Overdue invoices
const getOverdueInvoices = async (req, res) => {
  const now = new Date();
  const overdue = await Invoice.find({
    status: { $ne: 'paid' },
    dueDate: { $lt: now },
  });
  res.json(overdue);
};

// Active subscriptions
const getActiveSubscriptions = async (req, res) => {
  const active = await Subscription.countDocuments({ status: 'active' });
  res.json({ active });
};

// Churn rate
const getChurnRate = async (req, res) => {
  const total = await Subscription.countDocuments();
  const canceled = await Subscription.countDocuments({ status: 'canceled' });
  const churnRate = total > 0 ? ((canceled / total) * 100).toFixed(2) : 0;
  res.json({ churnRate: `${churnRate}%` });
};

// CSV export
const exportInvoicesCSV = async (req, res) => {
  const invoices = await Invoice.find();
  const parser = new Parser();
  const csv = parser.parse(invoices);

  res.header('Content-Type', 'text/csv');
  res.attachment('invoices_report.csv');
  res.send(csv);
};

module.exports = {
  
  getRevenueSummary,
  getOverdueInvoices,
  getActiveSubscriptions,
  getChurnRate,
  exportInvoicesCSV,
};
