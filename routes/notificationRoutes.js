// routes/notificationRoutes.js
import { Router } from 'express';
const router = Router();
import auth from '../middlewares/auth.js';
import Notification from '../models/Notification.js';
import notificationController from '../controllers/notificationController.js';

router.get('/:businessId', auth.protect, notificationController.getNotifications);
router.delete('/:id', auth.protect, notificationController.deleteNotifications);
export default router;