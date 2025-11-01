//notificationservice
const Notification = require('../models/Notification');
const Invoice = require('../models/Invoice');
const Subscription = require('../models/Subscription');
const { sendEmail } = require('../utils/emailService');

// Send invoice reminders before due date
const sendReminders = async () => {
    const today = new Date();
    const invoices = await Invoice.find({ status: 'pending' });

    for(const invoice of invoices){
        const diffDays = Math.ceil((invoice.dueDate - today) / (1000*60*60*24));

        if(diffDays <= 3 && diffDays >= 0){ // 3 days before due
            const subscription = await Subscription.findById(invoice.subscriptionId);
            const success = await sendEmail({
                to: subscription.customerEmail,
                subject: `Invoice Reminder: ${invoice.invoiceNumber}`,
                text: `Your invoice ${invoice.invoiceNumber} of $${invoice.amount} is due on ${invoice.dueDate.toDateString()}`
            });
            await Notification.create({
                subscriptionId: subscription._id,
                invoiceId: invoice._id,
                type: 'reminder',
                channel: 'email',
                status: success ? 'sent' : 'failed'
            });
        await logAction('NOTIFICATION_SENT', 'Invoice', invoice._id, { 
            type: 'reminder', 
            email: invoice.customerEmail });

        }

        // Late notice
        if(today > invoice.dueDate && invoice.status !== 'paid'){
            const subscription = await Subscription.findById(invoice.subscriptionId);
            const success = await sendEmail({
                to: subscription.customerEmail,
                subject: `Late Payment Notice: ${invoice.invoiceNumber}`,
                text: `Your invoice ${invoice.invoiceNumber} of $${invoice.amount} is overdue! Please pay immediately.`
            });
            await Notification.create({
                subscriptionId: subscription._id,
                invoiceId: invoice._id,
                type: 'late_notice',
                channel: 'email',
                status: success ? 'sent' : 'failed'
            });
            await logAction('NOTIFICATION_SENT', 'Invoice', invoice._id, { type: 'reminder', email: invoice.customerEmail });
        }
        

    }
};

module.exports = { sendReminders };
