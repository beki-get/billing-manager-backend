//
import { Router } from 'express';
const router = Router();
import paymentController from '../controllers/paymentController.js';
import auth from '../middlewares/auth.js';
import {validateSignature} from '../middlewares/webhookMiddleware.js';
import { validateRequest } from '../middlewares/validate.js';
import { invoiceIdParamSchema,webhookSchema} from '../validators/paymentValidator.js';


router.post('/pay-invoice/:invoiceId' ,validateRequest(invoiceIdParamSchema,'params') , paymentController.initializeInvoicePayment);
router.get('/pay-invoice/:invoiceId', validateRequest(invoiceIdParamSchema,'params') , paymentController.initializeInvoicePayment);
router.post('/webhook', validateRequest(webhookSchema), paymentController.handleChapaWebhook);
router.get('/payment-success', paymentController.handlePaymentSuccessView);

export default router;
