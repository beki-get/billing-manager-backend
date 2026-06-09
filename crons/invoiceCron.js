import { schedule } from 'node-cron';
import Subscription from '../models/Subscription.js';
import Invoice from '../models/Invoice.js';
import SubscriptionPlan from '../models/Plan.js';
import { addDays } from '../utils/date.js';
import { generateInvoiceNumber } from '../utils/invoiceNumber.js';
import logAction from '../utils/auditLogger.js';
import invoiceService from '../services/invoiceService.js';


const generateInvoice = () => {
    schedule('0 0 * * *', async () => { 
        const subscriptions = await Subscription.find({ status: 'active' });
          const today = new Date();
        for(const sub of subscriptions){
           
            if(sub.nextBillingDate <= today){
                const plan = await SubscriptionPlan.findById(sub.planId);
                
                const newInvoice = await invoiceService.createInvoice({
                    subscriptionId: sub._id,
                    businessId: sub.businessId,
                    invoiceNumber,
                    amount: plan.price,
                    currency: 'ETB',
                    dueDate: addDays(today, plan.duration),
                    clientName: sub.clientName,   
                    customerEmail: sub.customerEmail
                });
              await logAction('INVOICE_GENERATED', 'Invoice', newInvoice._id, 
                { amount: newInvoice.amount });
                // Updates next billing date
                sub.nextBillingDate = addDays(today, plan.duration);
                await sub.save();
            }
        }
    });
};

export default generateInvoice;
