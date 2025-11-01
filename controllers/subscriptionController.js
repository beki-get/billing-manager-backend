const Subscription = require('../models/Subscription');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const Invoice = require('../models/Invoice');
const { addDays } = require('../utils/date');
const { generateInvoiceNumber } = require('../utils/invoiceNumber');

// Create a new subscription
const createSubscription = async (req, res) => {
    const { businessId, planId, customerEmail } = req.body;

    const plan = await SubscriptionPlan.findById(planId);
    if(!plan) return res.status(404).json({ message: 'Plan not found' });

    const nextBillingDate = addDays(new Date(), plan.duration);

    const subscription = await Subscription.create({
        businessId,
        planId,
        customerEmail,
        nextBillingDate
    });

    // Auto-generate invoice for first cycle
    const invoiceCount = await Invoice.countDocuments({ businessId });
    const invoiceNumber = generateInvoiceNumber(businessId, invoiceCount + 1);

    const invoice = await Invoice.create({
        subscriptionId: subscription._id,
        businessId,
        invoiceNumber,
        amount: plan.price,
        currency: 'USD',
        dueDate: nextBillingDate
    });

    res.status(201).json({ subscription, invoice });
};

// Get all subscriptions for a business
const getSubscriptions = async (req, res) => {
    const subscriptions = await Subscription.find({ businessId: req.params.businessId })
        .populate('planId');
    res.json(subscriptions);
};
const updateSubscriptionStatus = async (req, res) => {
  const { status } = req.body;
  const subscription = await Subscription.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(subscription);
};
module.exports = { createSubscription, getSubscriptions, updateSubscriptionStatus };
