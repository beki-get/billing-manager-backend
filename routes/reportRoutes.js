//routes
import { Router } from 'express';
const router = Router();
import reportController from '../controllers/reportController.js';
import auth from '../middlewares/auth.js';
router.get('/revenue', auth.protect, reportController.getRevenueSummary);
router.get('/overdue', auth.protect, reportController.getOverdueInvoices);
router.get('/active', auth.protect, reportController.getActiveSubscriptions);
router.get('/churn', auth.protect, reportController.getChurnRate);
router.get('/export', auth.protect, reportController.exportInvoicesCSV);

export default router;
