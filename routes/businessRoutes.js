import { Router } from 'express';
const router = Router();
import businessController from '../controllers/businessController.js';
import auth from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import { createBusinessSchema } from  '../validators/businessValidator.js'
router.post('/', validateRequest(createBusinessSchema), auth.protect, businessController.createBusiness);
router.get('/', auth.protect, businessController.getUserBusinesses);

export default router;
