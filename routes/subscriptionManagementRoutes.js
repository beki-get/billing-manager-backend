//route
const express = require('express');
const router = express.Router();
const { createSubscription, getSubscriptions,updateSubscriptionStatus } = require('../controllers/subscriptionController');
const { protect } = require('../middlewares/auth');

router.post('/', protect, createSubscription);
router.get('/:businessId', protect, getSubscriptions);
router.put('/:id/status', protect, updateSubscriptionStatus);

module.exports = router;
