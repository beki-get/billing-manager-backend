// routes/invoiceRoutes.js
import { Router } from 'express';
const router = Router();
import auth from '../middlewares/auth.js';
import Invoice from '../models/Invoice.js';
import invoiceController from '../controllers/invoiceController.js';
import { validateRequest } from '../middlewares/validate.js';
import { createInvoiceSchema,updateInvoiceStatusSchema,invoiceParamsSchema} from '../validators/invoiceValidator.js'


router.get('/:businessId',validateRequest(invoiceParamsSchema ,'params') ,auth.protect,invoiceController.getInvoices);
// GET all invoices for a business
//router.get('/:', auth.protect,invoiceController.getInvoices);
//  create a new invoice for manual creation 
router.post('/',validateRequest(createInvoiceSchema ) , auth.protect, invoiceController.createInvoice);
// PATCH update invoice status
router.patch('/:id/',validateRequest(updateInvoiceStatusSchema,'params') , auth.protect, invoiceController.updateInvoiceStatus);

export default router;