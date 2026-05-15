//route
import { Router } from 'express';
const router = Router();
import subscriptionController from '../controllers/subscriptionController.js';
import auth from '../middlewares/auth.js';

router.post('/', auth.protect, subscriptionController.createSubscription);
router.get('/:businessId', auth.protect, subscriptionController.getSubscriptions);
router.put('/:id/status', auth.protect, subscriptionController.updateSubscriptionStatus);

export default router;
