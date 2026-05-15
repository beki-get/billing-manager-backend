// routes/invoiceRoutes.js
import { Router } from 'express';
const router = Router();
import auth from '../middlewares/auth.js';
import Invoice from '../models/Invoice.js';
import invoiceController from '../controllers/invoiceController.js';

// GET all invoices for a business
router.get('/:businessId', auth.protect,invoiceController.getInvoices);
router.get('/', auth.protect,invoiceController.getInvoices);
// POST create a new invoice
router.post('/', auth.protect, invoiceController.createInvoice);
// PATCH update invoice status
router.patch('/:id/status', auth.protect, invoiceController.updateInvoiceStatus);
export default router;