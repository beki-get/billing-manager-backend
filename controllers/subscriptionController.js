import { create, find, findByIdAndUpdate } from '../models/Subscription';
import { findById } from '../models/SubscriptionPlan';
import { countDocuments, create as _create } from '../models/Invoice';
import { addDays } from '../utils/date';
import { generateInvoiceNumber } from '../utils/invoiceNumber';

// Create a new subscription
const createSubscription = async (req, res) => {
    const { businessId, planId, customerEmail } = req.body;

    const plan = await findById(planId);
    if(!plan) return res.status(404).json({ message: 'Plan not found' });

    const nextBillingDate = addDays(new Date(), plan.duration);

    const subscription = await create({
        businessId,
        planId,
        customerEmail,
        nextBillingDate
    });

    //Auto-generate invoice for first cycle
    const invoiceCount = await countDocuments({ businessId });
    const invoiceNumber = generateInvoiceNumber(businessId, invoiceCount + 1);

    const invoice = await _create({
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
    const subscriptions = await find({ businessId: req.params.businessId })
        .populate('planId');
    res.json(subscriptions);
};
const updateSubscriptionStatus = async (req, res) => {
  const { status } = req.body;
  const subscription = await findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(subscription);
};
export default { createSubscription, getSubscriptions, updateSubscriptionStatus };
