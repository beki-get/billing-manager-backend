const cron = require('node-cron');
const Subscription = require('../models/Subscription');
const Invoice = require('../models/Invoice');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const { addDays } = require('../utils/date');
const { generateInvoiceNumber } = require('../utils/invoiceNumber');
const { logAction } = require('../utils/auditLogger');


const generateRecurringInvoices = () => {
    cron.schedule('0 0 * * *', async () => { // runs daily at midnight
        const subscriptions = await Subscription.find({ status: 'active' });
        
        for(const sub of subscriptions){
            const today = new Date();
            if(sub.nextBillingDate <= today){
                const plan = await SubscriptionPlan.findById(sub.planId);
                const invoiceCount = await Invoice.countDocuments({ businessId: sub.businessId });
                const invoiceNumber = generateInvoiceNumber(sub.businessId, invoiceCount + 1);

                await Invoice.create({
                    subscriptionId: sub._id,
                    businessId: sub.businessId,
                    invoiceNumber,
                    amount: plan.price,
                    currency: 'USD',
                    dueDate: addDays(today, plan.duration)
                });
              const newInvoice = await logAction('INVOICE_GENERATED', 'Invoice', newInvoice._id, 
                { amount: newInvoice.amount });


                // Update next billing date
                sub.nextBillingDate = addDays(today, plan.duration);
                await sub.save();
            }
        }
    });
};

module.exports = { generateRecurringInvoices };
