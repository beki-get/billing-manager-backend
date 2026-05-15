import express from 'express';
const router = express.Router();
import auditController from '../controllers/auditController.js';
import auth from '../middlewares/auth.js';

router.get('/', auth.protect, auditController.getAuditLogs);
router.delete('/clear', auth.protect, auditController.clearAuditLogs);

export default router;
