import Subscription from '../models/Subscription.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';
import Invoice from '../models/Invoice.js';
import { addDays } from '../utils/date.js';
import { generateInvoiceNumber } from '../utils/invoiceNumber.js';
import invoiceService from '../services/invoiceService.js';

// Create a new subscription
const createSubscription = async (req, res) => {
    const { businessId, planId, customerEmail,customerName } = req.body;

    const plan = await SubscriptionPlan.findById(planId);
    if(!plan) return res.status(404).json({ message: 'Plan not found' });

    const nextBillingDate = addDays(new Date(), plan.duration);

    const subscription = await Subscription.create({
        businessId,
        planId,
        customerEmail,
        customerName,
        nextBillingDate
    });

    const invoice = await invoiceService.createInvoice({
        subscriptionId: subscription._id,
        businessId,
        invoiceNumber: generateInvoiceNumber(),
        amount: plan.price,
        currency: 'USD',
        dueDate: nextBillingDate,
        clientName: subscription.customerName, 
        clientEmail: subscription.customerEmail
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
export default { createSubscription, getSubscriptions, updateSubscriptionStatus };
