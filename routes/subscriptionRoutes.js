const express = require('express');
const router = express.Router();
const { createPlan, getPlans, updatePlan, deletePlan } = require('../controllers/subscriptionPlanController').default;
const { protect } = require('../middlewares/auth').default;

// Protect all routes
router.post('/', protect, createPlan);
router.get('/:businessId', protect, getPlans);
router.put('/:id', protect, updatePlan);
router.delete('/:id', protect, deletePlan);

module.exports = router;
