// routes/invoiceRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth').default;
const Invoice = require('../models/Invoice');
const { createInvoice, getInvoices,updateInvoiceStatus } = require('../controllers/invoiceController').default;

// GET all invoices for a business
router.get('/:businessId', protect,getInvoices);
router.get('/', protect,getInvoices);
// POST create a new invoice
router.post('/', protect, createInvoice);
// PATCH update invoice status
router.patch('/:id/status', protect, updateInvoiceStatus);
module.exports = router;