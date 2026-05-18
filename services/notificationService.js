import emailService from '../utils/emailService.js';
import Notification from '../models/Notification.js';
import Invoice from '../models/Invoice.js';
import Subscription from '../models/Subscription.js';
import logAction from '../utils/auditLogger.js';


 // 1SENT AFTER INVOICE MARKS OVERDUE (Called by invoicecron.js)
 
const sendOverdueReminder = async (invoice) => {
    if (!invoice.clientEmail) return;

    const mailoptions = {
        from: process.env.EMAIL_USER,
        to: invoice.clientEmail,
        subject: `Payment Reminder for Invoice ${invoice.invoiceNumber}`,
        html: `
            <p>Hi ${invoice.clientName || 'Customer'},</p>
            <p>This is a reminder that your invoice <strong>${invoice.invoiceNumber}</strong> of amount <strong>$${invoice.amount}</strong> was due on <strong>${invoice.dueDate.toDateString()}</strong> and is now overdue.</p>
            <p>Please make the payment at your earliest convenience.</p>
            <p>Thank you!</p>
        `
    };

    await emailService.sendMail(mailoptions);
    console.log(`Overdue alert sent to ${invoice.clientEmail}`);
};


 // SENT 3 DAYS BEFORE DUE DATE (Your old code, optimized with your correct schema names)
 
const sendUpcomingReminders = async () => {
    const today = new Date();
    const invoices = await Invoice.find({ status: 'pending' });

    for (const invoice of invoices) {
        // Calculate difference in days
        const diffDays = Math.ceil((invoice.dueDate - today) / (1000 * 60 * 60 * 24));

        // 3 days before due date warning
        if (diffDays <= 3 && diffDays >= 0) {
            const subscription = await Subscription.findById(invoice.subscriptionId);
            
            // Notice: Changed subscription.customerEmail to clientEmail to match your schema!
            const success = await emailService.sendMail({
                to: invoice.clientEmail, 
                subject: `Invoice Reminder: ${invoice.invoiceNumber}`,
                text: `Your invoice ${invoice.invoiceNumber} of $${invoice.amount} is due on ${invoice.dueDate.toDateString()}`
            });

            // Save transaction history tracking document
            await Notification.create({
                subscriptionId: subscription?._id || null,
                invoiceId: invoice._id,
                type: 'reminder',
                channel: 'email',
                status: success ? 'sent' : 'failed'
            });

            await logAction('NOTIFICATION_SENT', 'Invoice', invoice._id, { 
                type: 'reminder', 
                email: invoice.clientEmail 
            });
        }
    }
};
export default { sendOverdueReminder, sendUpcomingReminders };