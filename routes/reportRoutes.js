//routes
const express = require('express');
const router = express.Router();
const {
  getRevenueSummary,
  getOverdueInvoices,
  getActiveSubscriptions,
  getChurnRate,
  exportInvoicesCSV,
} = require('../controllers/reportController');
const { protect } = require('../middlewares/auth');
router.get('/revenue', protect, getRevenueSummary);
router.get('/overdue', protect, getOverdueInvoices);
router.get('/active', protect, getActiveSubscriptions);
router.get('/churn', protect, getChurnRate);
router.get('/export', protect, exportInvoicesCSV);

module.exports = router;
