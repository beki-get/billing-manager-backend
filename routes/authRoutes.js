import { Router } from 'express';
const router = Router();
import authController from '../controllers/authController.js';


router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

export default router;
