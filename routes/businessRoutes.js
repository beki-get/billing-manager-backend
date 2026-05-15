import { Router } from 'express';
const router = Router();
import businessController from '../controllers/businessController.js';
import auth from '../middlewares/auth.js';

router.post('/', auth.protect, businessController.createBusiness);
router.get('/', auth.protect, businessController.getUserBusinesses);

export default router;
