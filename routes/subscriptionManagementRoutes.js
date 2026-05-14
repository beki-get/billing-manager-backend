//route
const express = require('express');
const router = express.Router();
const { createSubscription, getSubscriptions,updateSubscriptionStatus } = require('../controllers/subscriptionController').default;
const { protect } = require('../middlewares/auth').default;

router.post('/', protect, createSubscription);
router.get('/:businessId', protect, getSubscriptions);
router.put('/:id/status', protect, updateSubscriptionStatus);

module.exports = router;
