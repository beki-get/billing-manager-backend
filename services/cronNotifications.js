//services/cronNotifications.js
import { schedule } from 'node-cron';
import sendReminders from './notificationService.js';

const startNotificationCron = () => {
    schedule('0 8 * * *', async () => { // runs daily at 8 AM
        console.log('Running notification cron...');
        await sendReminders();
    });
};

export default startNotificationCron;
