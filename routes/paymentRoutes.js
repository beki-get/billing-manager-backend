// /routes/paymentRoutes.js
import { Router } from 'express';
const router = Router();
import paymentController from '../controllers/paymentController.js';
import auth from '../middlewares/auth.js';

// Create a Stripe payment intent for an invoice
console.log('protect is:', typeof auth.protect);

router.post('/stripe', auth.protect, paymentController.payInvoiceStripe);

export default router;
