import { schedule } from 'node-cron';
import Subscription from '../models/Subscription.js';
import Invoice from '../models/Invoice.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';
import { addDays } from '../utils/date.js';
import { generateInvoiceNumber } from '../utils/invoiceNumber.js';
import logAction from '../utils/auditLogger.js';


const generateRecurringInvoices = () => {
    schedule('0 0 * * *', async () => { // runs daily at midnight
        const subscriptions = await Subscription.find({ status: 'active' });
        
        for(const sub of subscriptions){
            const today = new Date();
            if(sub.nextBillingDate <= today){
                const plan = await SubscriptionPlan.findById(sub.planId);
                const invoiceCount = await Invoice.countDocuments({ businessId: sub.businessId });
                const invoiceNumber = generateInvoiceNumber(sub.businessId, invoiceCount + 1);

                const newInvoice = await Invoice.create({
                    subscriptionId: sub._id,
                    businessId: sub.businessId,
                    invoiceNumber,
                    amount: plan.price,
                    currency: 'USD',
                    dueDate: addDays(today, plan.duration)
                });
              await logAction('INVOICE_GENERATED', 'Invoice', newInvoice._id, 
                { amount: newInvoice.amount });


                // Update next billing date
                sub.nextBillingDate = addDays(today, plan.duration);
                await sub.save();
            }
        }
    });
};

export default generateRecurringInvoices;
