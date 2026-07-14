import { Router } from 'express';
const router = Router();
import planController from '../controllers/planController.js';
import auth from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import { createPlanSchema,updatePlanSchema } from '../validators/planValidator.js';


// Protect all routes
router.post('/', validateRequest(createPlanSchema), auth.protect, planController.createPlan);
router.get('/:businessId', auth.protect, planController.getPlans);
router.put('/:id', validateRequest(updatePlanSchema),auth.protect, planController.updatePlan);
router.delete('/:id', auth.protect, planController.deletePlan);

export default router;
