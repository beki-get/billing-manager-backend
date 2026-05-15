import { schedule } from 'node-cron';
import Invoice from '../models/Invoice.js';
import emailService from '../utils/emailService.js';

// Run every day at midnight
schedule('0 0 * * *', async () => {
    console.log('Running invoice overdue check...');

    try {
        const today = new Date();

        // 1️⃣ Find overdue invoices
        const overdueInvoices = await Invoice.find({
            status: 'pending',
            dueDate: { $lt: today }
        });

        // 2️⃣ Update them
        for (let invoice of overdueInvoices) {
            invoice.status = 'overdue';
            await invoice.save();
    
       //send email reminder
       if(invoice.clientEmail){
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
        await emailService.sendMail(mailoptions) 
         console.log(`Reminder sent to ${invoice.clientEmail}`);
       }
    }
    } catch (err) {
        console.error('cron job error:', err);
    }
});

export default true;
