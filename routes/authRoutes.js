import { Router } from 'express';
const router = Router();
import authController from '../controllers/authController.js';
import { validateRequest } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';


router.post('/register',validateRequest(registerSchema), authController.registerUser);
router.post('/login', validateRequest(loginSchema), authController.loginUser);

export default router;
