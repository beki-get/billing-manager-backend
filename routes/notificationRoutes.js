// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const Notification = require('../models/Notification');

router.get('/:businessId', protect, async (req, res) => {
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

module.exports = router;