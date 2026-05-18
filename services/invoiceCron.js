import { schedule } from 'node-cron';
import invoiceService from '../services/invoiceService.js';
import notificationService from '../services/notificationService.js';

schedule('0 0 * * *', async () => {
    console.log('Running invoice overdue check...');
    try {
        // service handle database mutations
        const overdueInvoices = await invoiceService.checkAndMarkOverdue();

        // Send emails using the notification engine
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