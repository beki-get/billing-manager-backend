// /routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { payInvoiceStripe } = require('../controllers/paymentController');
const { protect } = require('../middlewares/auth');

// Create a Stripe payment intent for an invoice
console.log('protect is:', typeof protect);

router.post('/stripe', protect, payInvoiceStripe);

module.exports = router;
