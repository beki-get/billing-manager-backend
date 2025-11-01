const cron = require('node-cron');
const { sendReminders } = require('./notificationService');

const startNotificationCron = () => {
    cron.schedule('0 8 * * *', async () => { // runs daily at 8 AM
        console.log('Running notification cron...');
        await sendReminders();
    });
};

module.exports = { startNotificationCron };
