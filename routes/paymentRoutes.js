//
import { Router } from 'express';
const router = Router();
import paymentController from '../controllers/paymentController.js';
import auth from '../middlewares/auth.js';
import {validateSignature} from '../middlewares/webhookMiddleware.js';


router.post('/pay-invoice/:invoiceId', paymentController.initializeInvoicePayment);
router.get('/pay-invoice/:invoiceId', paymentController.initializeInvoicePayment);
router.post('/webhook', validateSignature, paymentController.handleChapaWebhook);
router.get('/payment-success', paymentController.handlePaymentSuccessView);

export default router;
