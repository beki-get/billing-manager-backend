// routes/invoiceRoutes.js
import { Router } from 'express';
const router = Router();
import auth from '../middlewares/auth.js';
import Invoice from '../models/Invoice.js';
import invoiceController from '../controllers/invoiceController.js';


router.get('/:businessId', auth.protect,invoiceController.getInvoices);
// GET all invoices for a business
//router.get('/:', auth.protect,invoiceController.getInvoices);
//  create a new invoice for manual creation 
router.post('/', auth.protect, invoiceController.createInvoice);
// PATCH update invoice status
router.patch('/:id/', auth.protect, invoiceController.updateInvoiceStatus);

export default router;