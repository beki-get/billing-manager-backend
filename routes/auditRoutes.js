import express from 'express';
const router = express.Router();
import { getAuditLogs, clearAuditLogs } from '../controllers/auditController';
import { protect } from '../middlewares/auth';

router.get('/', protect, getAuditLogs);
router.delete('/clear', protect, clearAuditLogs);

export default router;
