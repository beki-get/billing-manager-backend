// routes/invoiceRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const Invoice = require('../models/Invoice');

// GET all invoices for a business
router.get('/:businessId', protect, async (req, res) => {
  try {
    const invoices = await Invoice.find({ businessId: req.params.businessId })
      .populate('subscriptionId', 'customerEmail')
      .sort({ dueDate: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;