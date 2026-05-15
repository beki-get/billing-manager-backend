import { Router } from 'express';
const router = Router();
import subscriptionPlanController from '../controllers/subscriptionPlanController.js';
import auth from '../middlewares/auth.js';

// Protect all routes
router.post('/', auth.protect, subscriptionPlanController.createPlan);
router.get('/:businessId', auth.protect, subscriptionPlanController.getPlans);
router.put('/:id', auth.protect, subscriptionPlanController.updatePlan);
router.delete('/:id', auth.protect, subscriptionPlanController.deletePlan);

export default router;
