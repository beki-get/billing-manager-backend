// routes/notificationRoutes.js
import { Router } from 'express';
const router = Router();
import auth from '../middlewares/auth.js';
import Notification from '../models/Notification.js';

router.get('/:businessId', auth.protect, async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate({
        path: 'subscriptionId',
        match: { businessId: req.params.businessId },
        select: 'customerEmail'
      })
      .populate('invoiceId', 'invoiceNumber')
      .sort({ sentAt: -1 })
      .limit(20);

    // Filter out null subscriptions
    const filtered = notifications.filter(n => n.subscriptionId);
    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;