//route
import { Router } from 'express';
const router = Router();
import subscriptionController from '../controllers/subscriptionController.js';
import auth from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import { createSubscriptionSchema,subscriptionParamsSchema} from '../validators/subscriptionValidator.js';

router.post('/', validateRequest(createSubscriptionSchema), auth.protect, subscriptionController.createSubscription);
router.get('/:businessId', validateRequest(subscriptionParamsSchema,'params' ), auth.protect, subscriptionController.getSubscriptions);
router.put('/:id/status', validateRequest(subscriptionParamsSchema ,'params'),auth.protect, subscriptionController.updateSubscriptionStatus);

export default router;
