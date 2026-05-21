import { Router } from 'express';
const router = Router();
import planController from '../controllers/planController.js';
import auth from '../middlewares/auth.js';

// Protect all routes
router.post('/', auth.protect, planController.createPlan);
router.get('/:businessId', auth.protect, planController.getPlans);
router.put('/:id', auth.protect, planController.updatePlan);
router.delete('/:id', auth.protect, planController.deletePlan);

export default router;
