//this is the main service file or logic for sending overdue and upcoming reminders
//it can also handle deleting and accessing(get) notifications from database

import emailService from '../utils/emailService.js';
import Notification from '../models/Notification.js';
import Invoice from '../models/Invoice.js';
import Subscription from '../models/Subscription.js';
import logAction from '../utils/auditLogger.js';

const sendOverdueReminder = async (invoice) => {
    if (!invoice.customerEmail) return;

    const mailoptions = {
        from:'"Billing System" <system@my-app.com>',
        to: invoice.customerEmail,
        subject: `Payment Reminder for Invoice ${invoice.invoiceNumber}`,
        html: `
            <p>Hi ${invoice.customerName || 'Customer'},</p>
            <p>This is a reminder that your invoice <strong>${invoice.invoiceNumber}</strong> 
             of amount <strong>$${invoice.amount}</strong>
             was due on <strong>${invoice.dueDate.toDateString()}</strong> and is now overdue.</p>
            <p>Please make the payment at your earliest convenience.</p>
            <p>Thank you!</p>
        `
    };

    await emailService.sendMail(mailoptions);
    console.log(`Overdue alert sent to ${invoice.customerEmail}`);

    await Notification.create({
        businessId: invoice.businessId,
        subscriptionId: invoice.subscriptionId,
        invoiceId: invoice._id,
        type: 'late_notice',
        channel: 'email',
        status: 'sent'
    });
};

const sendUpcomingReminders = async () => {
    const today = new Date();
    const invoices = await Invoice.find({ status: 'pending' });
    for (const invoice of invoices) {
        const diffDays = Math.ceil((invoice.dueDate - today) / (1000 * 60 * 60 * 24));
        if (diffDays <= 3 && diffDays >= 0) {
            
            const alreadyNotified = await Notification.findOne({
                invoiceId: invoice._id,
                type: 'reminder',
                status: 'sent'
            });
            if (alreadyNotified) {
                console.log(`⏩ Skipping Invoice ${invoice.invoiceNumber}: Reminder already sent.`);
                continue; 
            }
            const subscription = await Subscription.findById(invoice.subscriptionId);
            const success = await emailService.sendMail({
                from: '"Billing System" <system@my-app.com>',
                to: invoice.customerEmail, 
                subject: `Invoice Reminder: ${invoice.invoiceNumber}`,
                text: `Your invoice ${invoice.invoiceNumber} of $${invoice.amount} is due on ${invoice.dueDate.toDateString()}`
            });
            await Notification.create({
                businessId: invoice.businessId,
                subscriptionId: subscription?._id || null,
                invoiceId: invoice._id,
                type: 'reminder',
                channel: 'email',
                status: success ? 'sent' : 'failed'
            });

            await logAction('NOTIFICATION_SENT', 'Invoice', invoice._id, { 
                type: 'reminder', 
                email: invoice.customerEmail 
            });
        }
    }
   
};

const getNotifications =async(businessId)=>{
 const notifications= await Notification.find({businessId})
  .populate('subscriptionId','customerEmail')
   .populate('invoiceId','invoiceNumber')
    .sort({ sentAt: -1 })
    .limit(20);
    return notifications;

}

const deleteNotifications= async (notificationId, businessId)=>{
      const deleted= await Notification.deleteOne({ 
        _id: notificationId, businessId });
      return deleted;
}
export default { sendOverdueReminder, sendUpcomingReminders, getNotifications, deleteNotifications };