const express = require('express');
const router = express.Router();
const { getAuditLogs, clearAuditLogs } = require('../controllers/auditController');
const { protect } = require('../middlewares/auth');

router.get('/', protect, getAuditLogs);
router.delete('/clear', protect, clearAuditLogs);

module.exports = router;
