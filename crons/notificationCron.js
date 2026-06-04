//this is cron schedule that runs every 24 hr at midnight 
//it main purpose is to check for pending invoices that its duedate already passed and also 
//for invoices that are 3 days left
import { schedule } from 'node-cron';
import invoiceService from '../services/invoiceService.js';
import notificationService from '../services/notificationService.js';

schedule('0 0 * * *', async () => {
    console.log('Running invoice overdue check...');
    try {
        const overdueInvoices = await invoiceService.checkAndMarkOverdue();
        for (const invoice of overdueInvoices) {
            await notificationService.sendOverdueReminder(invoice);
        }
    } catch (err) {
        console.error('cron job error:', err);
    }
    
    try {
        console.log('Checking for upcoming invoice reminders...');
        await notificationService.sendUpcomingReminders(); 
    } catch (err) {
        console.error('Upcoming reminder cron job error:', err);
    }
});

export default true;